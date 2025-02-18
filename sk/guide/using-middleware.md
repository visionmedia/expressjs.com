---
layout: page
title: Použitie Express middleware
description: Learn how to use middleware in Express.js applications, including application-level and router-level middleware, error handling, and integrating third-party middleware.
menu: guide
lang: sk
redirect_from: /guide/using-middleware.html
---

# Použitie middleware

Express je webový framework s minimálnou vlastnou funkcionalitou: Express aplikácia je v podstate séria volaní middleware funkcií.

_Middleware_ functions are functions that have access to the [request object](/{{ page.lang }}/4x/api.html#req)  (`req`), the [response object](/{{ page.lang }}/4x/api.html#res) (`res`), and the next middleware function in the application's request-response cycle. The next middleware function is commonly denoted by a variable named `next`.

Middleware funkcie dokážu vykonávať nasledujúce úlohy:

- Vykonať akýkoľvek kód.
- Vykonať zmeny na request a response objektoch.
- Ukončiť request-response cyklus.
- Zavolať nasledujúcu middleware funkciu v poradí.

If the current middleware function does not end the request-response cycle, it must call `next()` to pass control to the next middleware function. Otherwise, the request will be left hanging.

Express aplikácia môže použiť nasledovné typy middleware funkcií:

- [Application-level middleware](#middleware.application)
- [Router-level middleware](#middleware.router)
- [Error-handling middleware](#middleware.error-handling)
- [Built-in middleware](#middleware.built-in)
- [Third-party middleware](#middleware.third-party)

You can load application-level and router-level middleware with an optional mount path.
You can also load a series of middleware functions together, which creates a sub-stack of the middleware system at a mount point.

<h2 id='middleware.application'>Application-level middleware</h2>

Bind application-level middleware to an instance of the [app object](/{{ page.lang }}/4x/api.html#app) by using the `app.use()` and `app.METHOD()` functions, where `METHOD` is the HTTP method of the request that the middleware function handles (such as GET, PUT, or POST) in lowercase.

This example shows a middleware function with no mount path. The function is executed every time the app receives a request.

```js
const app = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```

This example shows a middleware function mounted on the `/user/:id` path. The function is executed for any type of
HTTP request on the `/user/:id` path.

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

This example shows a route and its handler function (middleware system). The function handles GET requests to the `/user/:id` path.

```js
app.get('/user/:id', (req, res, next) => {
  res.send('USER')
})
```

Here is an example of loading a series of middleware functions at a mount point, with a mount path.
It illustrates a middleware sub-stack that prints request info for any type of HTTP request to the `/user/:id` path.

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

Route handlers enable you to define multiple routes for a path. The example below defines two routes for GET requests to the `/user/:id` path. The second route will not cause any problems, but it will never get called because the first route ends the request-response cycle.

Tento príklad zobrazuje middleware sub-stack ktorý handluje GET requesty na ceste `/user/:id`.

```js
app.get('/user/:id', (req, res, next) => {
  console.log('ID:', req.params.id)
  next()
}, (req, res, next) => {
  res.send('User Info')
})

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', (req, res, next) => {
  res.end(req.params.id)
})
```

To skip the rest of the middleware functions from a router middleware stack, call `next('route')` to pass control to the next route.

{% include admonitions/note.html content="`next('route')` will work only in middleware functions that were loaded by using the `app.METHOD()` or `router.METHOD()` functions." %}

This example shows a middleware sub-stack that handles GET requests to the `/user/:id` path.

```js
app.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, (req, res, next) => {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', (req, res, next) => {
  res.send('special')
})
```

Router-level middleware funguje rovnakým spôsobom ako application-level middleware, avšak je pripojený k `express.Router()` inštancii.

This example shows an array with a middleware sub-stack that handles GET requests to the `/user/:id` path

```js
function logOriginalUrl (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}

function logMethod (req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

const logStuff = [logOriginalUrl, logMethod]
app.get('/user/:id', logStuff, (req, res, next) => {
  res.send('User Info')
})
```

<h2 id='middleware.router'>Router-level middleware</h2>

Router-level middleware works in the same way as application-level middleware, except it is bound to an instance of `express.Router()`.

```js
const router = express.Router()
```

Load router-level middleware by using the `router.use()` and `router.METHOD()` functions.

Error-handling middleware funkcie sa definujú rovnako ako ostatné middleware funkcie, len majú štyri argumenty namiesto troch, špecificky podľa signatúry `(err, req, res, next)`:

```js
const express = require('express')
const app = express()
const router = express.Router()

// a middleware function with no mount path. This code is executed for every request to the router
router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next router
  if (req.params.id === '0') next('route')
  // otherwise pass control to the next middleware function in this stack
  else next()
}, (req, res, next) => {
  // render a regular page
  res.render('regular')
})

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', (req, res, next) => {
  console.log(req.params.id)
  res.render('special')
})

// mount the router on the app
app.use('/', router)
```

Pre viac informácií ohľadom error-handling middlewarov si pozrite sekciu: [Error handling](/{{ page.lang }}/guide/error-handling.html).

This example shows a middleware sub-stack that handles GET requests to the `/user/:id` path.

```js
const express = require('express')
const app = express()
const router = express.Router()

// predicate the router with a check and bail out when needed
router.use((req, res, next) => {
  if (!req.headers['x-auth']) return next('router')
  next()
})

router.get('/user/:id', (req, res) => {
  res.send('hello, user!')
})

// use the router and 401 anything falling through
app.use('/admin', router, (req, res) => {
  res.sendStatus(401)
})
```

<h2 id='middleware.error-handling'>Error-handling middleware</h2>

<div class="doc-box doc-notice" markdown="1">
Error-handling middleware always takes _four_ arguments. You must provide four arguments to identify it as an error-handling middleware function. Even if you don't need to use the `next` object, you must specify it to maintain the signature. Otherwise, the `next` object will be interpreted as regular middleware and will fail to handle errors.
</div>

Define error-handling middleware functions in the same way as other middleware functions, except with four arguments instead of three, specifically with the signature `(err, req, res, next)`:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

Informácie ohľadom `options` parametra ako i ďalšie detaily ohľadom tohto middleware nájdete tu: [express.static](/sk/4x/api.html#express.static).

<h2 id='middleware.built-in'>Built-in middleware</h2>

Starting with version 4.x, Express no longer depends on [Connect](https://github.com/senchalabs/connect). The middleware
functions that were previously included with Express are now in separate modules; see [the list of middleware functions](https://github.com/senchalabs/connect#middleware).

Môžete nastaviť aj viac ako jeden priečinok so statickým obsahom:

- [express.static](/en/4x/api.html#express.static) serves static assets such as HTML files, images, and so on.
- [express.json](/en/4x/api.html#express.json) parses incoming requests with JSON payloads. **NOTE: Available with Express 4.16.0+**
- [express.urlencoded](/en/4x/api.html#express.urlencoded) parses incoming requests with URL-encoded payloads.  **NOTE: Available with Express 4.16.0+**

<h2 id='middleware.third-party'>Third-party middleware</h2>

Use third-party middleware to add functionality to Express apps.

V Express aplikácii možete využiť taktiež third-party middleware funkcionalitu.

Nainštalujte požadovaný Node.js modul a načítajte ho do aplikácie ako aplikačný, či router middleware.

```bash
$ npm install cookie-parser
```

```js
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

// load the cookie-parsing middleware
app.use(cookieParser())
```

For a partial list of third-party middleware functions that are commonly used with Express, see: [Third-party middleware](../resources/middleware.html).
