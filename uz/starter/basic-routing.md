---
layout: page
title: Express asosiy marshrutizatsiya
description: Learn the fundamentals of routing in Express.js applications, including how to define routes, handle HTTP methods, and create route handlers for your web server.
menu: starter
lang: uz
redirect_from: /starter/basic-routing.html
---

# Asosiy marshrutizatsiya

_Routing_ refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

Har bir marshrut(route) bir yoki ko'plar qayta ishlovchi funksiyalarga ega.

Marshrutni aniqlash quyidagi ko'rinishga ega `app.METHOD(PATH, HANDLER)`, bu yerda `app` `express`ning ekzamplyari, `METHOD` esa [HTTP request method](http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol), `PATH` esa saytdagi manzili va `HANDLER` esa marshrut chaqirilganda bajariladinga funksiya.

```js
app.METHOD(PATH, HANDLER)
```

Quyidagi kodlar marshrutizatsiyaga bir necha misollar keltirilgan.

- `app` is an instance of `express`.
- `METHOD` is an [HTTP request method](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods), in lowercase.
- `PATH` is a path on the server.
- `HANDLER` is the function executed when the route is matched.

<div class="doc-box doc-notice" markdown="1">
This tutorial assumes that an instance of `express` named `app` is created and the server is running. If you are not familiar with creating an app and starting it, see the [Hello world example](/{{ page.lang }}/starter/hello-world.html).
</div>

The following examples illustrate defining simple routes.

Respond with `Hello World!` on the homepage:

```js
app.get('/', (req, res) => {
  res.send('Hello World!')
})
```

Respond to POST request on the root route (`/`), the application's home page:

```js
app.post('/', (req, res) => {
  res.send('Got a POST request')
})
```

Respond to a PUT request to the `/user` route:

```js
app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})
```

Respond to a DELETE request to the `/user` route:

```js
app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})
```

For more details about routing, see the [routing guide](/{{ page.lang }}/guide/routing.html).

### [Previous: Express application generator ](/{{ page.lang }}/starter/generator.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: Serving static files in Express ](/{{ page.lang }}/starter/static-files.html)
