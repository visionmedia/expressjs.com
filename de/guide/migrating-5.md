---
layout: page
title: Migration auf Express 5
description: A comprehensive guide to migrating your Express.js applications from version 4 to 5, detailing breaking changes, deprecated methods, and new improvements.
menu: guide
lang: de
redirect_from: /guide/migrating-5.html
---

# Wechsel zu Express 5

<h2 id="overview">Überblick</h2>

Express 5.0 befindet sich noch in der Beta-Release-Phase. Hier finden Sie jedoch bereits eine Vorschau zu den Änderungen in diesem Release und zur Migration Ihrer Express 4-Anwendung auf Express 5.

To install this version, you need to have a Node.js version 18 or higher. Then, execute the following command in your application directory:

```sh
$ npm install "express@^{{ site.data.express.next_version }}" --save
```

Sie können Ihre automatisierten Tests ausführen, um zu sehen, was fehlschlägt, und Probleme gemäß den folgenden Updates beheben. Nachdem Sie alle Testfehler behoben haben, führen Sie Ihre Anwendung aus, um zu sehen, welche Fehler noch auftreten. Sie werden sofort feststellen, ob die Anwendung Methoden oder Eigenschaften verwendet, die nicht unterstützt werden.

<h2 id="changes">Änderungen in Express 5</h2>

**Entfernte Methoden und Eigenschaften**

<ul class="doclist">
  <li><a href="#app.del">app.del()</a></li>
  <li><a href="#app.param">app.param(fn)</a></li>
  <li><a href="#plural">Pluralisierte Methodennamen</a></li>
  <li><a href="#leading">Führender Doppelpunkt im Namensargument für app.param(name, fn)</a></li>
  <li><a href="#req.param">req.param(name)</a></li>
  <li><a href="#res.json">res.json(obj, status)</a></li>
  <li><a href="#res.jsonp">res.jsonp(obj, status)</a></li>
  <li><a href="#magic-redirect">res.redirect('back') and res.location('back')</a></li>  
  <li><a href="#res.redirect">res.redirect(url, status)</a></li>
  <li><a href="#res.send.body">res.send(body, status)</a></li>
  <li><a href="#res.send.status">res.send(status)</a></li>
  <li><a href="#res.sendfile">res.sendfile()</a></li>
</ul>

**Verbesserungen**

<ul class="doclist">
  <li><a href="#path-syntax">Path route matching syntax</a></li>
  <li><a href="#rejected-promises">Rejected promises handled from middleware and handlers</a></li>
  <li><a href="#express.urlencoded">express.urlencoded</a></li>
  <li><a href="#app.listen">app.listen</a></li>
  <li><a href="#app.router">app.router</a></li>
  <li><a href="#req.body">req.body</a></li>
  <li><a href="#req.host">req.host</a></li>
  <li><a href="#req.query">req.query</a></li>
  <li><a href="#res.clearCookie">res.clearCookie</a></li>
  <li><a href="#res.status">res.status</a></li>
  <li><a href="#res.vary">res.vary</a></li>
</ul>

**Geändert**

<ul class="doclist">
  <li><a href="#res.render">res.render()</a></li>
  <li><a href="#brotli-support">Brotli encoding support</a></li>
</ul>

### Entfernte Methoden und Eigenschaften

Wenn Sie eine dieser Methoden oder Eigenschaften in Ihrer Anwendung verwenden, stürzt die Anwendung ab. Sie müssen also Ihre Anwendung ändern, wenn Sie auf Version 5 umgestellt haben.

<h4 id="app.del">app.del()</h4>

Express 5 unterstützt die Funktion `app.del()` nicht mehr. Wenn Sie diese Funktion verwenden, wird ein Fehler ausgelöst. Für die Registrierung von HTTP DELETE-Weiterleitungen verwenden Sie stattdessen die Funktion `app.delete()`.

Anfänglich wurde `del` statt `delete` verwendet, weil `delete` in JavaScript ein reserviertes Schlüsselwort ist. Ab ECMAScript 6 jedoch können `delete` und andere reservierte Schlüsselwörter legal als Eigenschaftsnamen verwendet werden.

```js
// v4
app.del('/user/:id', (req, res) => {
  res.send(`DELETE /user/${req.params.id}`)
})

// v5
app.delete('/user/:id', (req, res) => {
  res.send(`DELETE /user/${req.params.id}`)
})
```

<h4 id="app.param">app.param(fn)</h4>

Die Signatur `app.param(fn)` wurde für die Änderung der Verhaltensweise der Funktion `app.param(name, fn)` verwendet. Seit v4.11.0 wurde sie nicht mehr verwendet. In Express 5 wird sie überhaupt nicht mehr unterstützt.

<h4 id="plural">Pluralisierte Methodennamen</h4>

Die folgenden Methodennamen wurden pluralisiert. In Express 4 wurde bei Verwendung der alten Methoden eine Warnung zur Einstellung der Unterstützung ausgegeben. Express 5 unterstützt diese Methoden nicht mehr.

`req.acceptsLanguage()` wird durch `req.acceptsLanguages()` ersetzt.

`req.acceptsCharset()` wird durch `req.acceptsCharsets()` ersetzt.

`req.acceptsEncoding()` wird durch `req.acceptsEncodings()` ersetzt.

```js
// v4
app.all('/', (req, res) => {
  req.acceptsCharset('utf-8')
  req.acceptsEncoding('br')
  req.acceptsLanguage('en')

  // ...
})

// v5
app.all('/', (req, res) => {
  req.acceptsCharsets('utf-8')
  req.acceptsEncodings('br')
  req.acceptsLanguages('en')

  // ...
})
```

<h4 id="leading">Führender Doppelpunkt (:) im Namen für app.param(name, fn)</h4>

Ein führendes Doppelpunktzeichen (:) im Namen für die Funktion `app.param(name, fn)` ist ein Überbleibsel aus Express 3. Aus Gründen der Abwärtskompatibilität wurde dieser Name in Express 4 mit einem Hinweis zu veralteten Versionen weiter unterstützt. In Express 5 wird dieser Name stillschwiegend ignoriert und der Namensparameter ohne einen vorangestellten Doppelpunkt verwendet.

Dies dürfte keine Auswirkungen auf Ihren Code haben, wenn Sie die Express 4-Dokumentation zu [app.param](/{{ page.lang }}/4x/api.html#app.param) befolgen, da dort der führende Doppelpunkt nicht erwähnt wird.

<h4 id="req.param">req.param(name)</h4>

Dieses potenziell verwirrende und durchaus riskante Verfahren des Abrufens von Formulardaten wurde entfernt. Sie müssen nun ganz speziell nach dem übergebenen Parameternamen im Objekt `req.params`, `req.body` oder `req.query` suchen.

```js
// v4
app.post('/user', (req, res) => {
  const id = req.param('id')
  const body = req.param('body')
  const query = req.param('query')

  // ...
})

// v5
app.post('/user', (req, res) => {
  const id = req.params.id
  const body = req.body
  const query = req.query

  // ...
})
```

<h4 id="res.json">res.json(obj, status)</h4>

Express 5 unterstützt die Signatur `res.json(obj, status)` nicht mehr. Stattdessen müssen Sie den Status festlegen und diesen dann mit `res.json()`-Methoden wie  dieser verketten: `res.status(status).json(obj)`.

```js
// v4
app.post('/user', (req, res) => {
  res.json({ name: 'Ruben' }, 201)
})

// v5
app.post('/user', (req, res) => {
  res.status(201).json({ name: 'Ruben' })
})
```

<h4 id="res.jsonp">res.jsonp(obj, status)</h4>

Express 5 unterstützt die Signatur `res.jsonp(obj, status)` nicht mehr. Stattdessen müssen Sie den Status festlegen und diesen dann mit `res.jsonp()`-Methoden wie  dieser verketten: `res.status(status).jsonp(obj)`.

```js
// v4
app.post('/user', (req, res) => {
  res.jsonp({ name: 'Ruben' }, 201)
})

// v5
app.post('/user', (req, res) => {
  res.status(201).jsonp({ name: 'Ruben' })
})
```

<h4 id="res.redirect">res.redirect(url, status)</h4>

Express 5 unterstützt die Signatur `res.send(obj, status)` nicht mehr. Stattdessen müssen Sie den Status festlegen und diesen dann mit `res.send()`-Methoden wie  dieser verketten: `res.status(status).send(obj)`.

```js
// v4
app.get('/user', (req, res) => {
  res.redirect('/users', 301)
})

// v5
app.get('/user', (req, res) => {
  res.redirect(301, '/users')
})
```

<h4 id="magic-redirect">res.redirect('back') and res.location('back')</h4>

Express 5 no longer supports the magic string `back` in the `res.redirect()` and `res.location()` methods. Instead, use the `req.get('Referrer') || '/'` value to redirect back to the previous page. In Express 4, the res.`redirect('back')` and `res.location('back')` methods were deprecated.

```js
// v4
app.get('/user', (req, res) => {
  res.redirect('back')
})

// v5
app.get('/user', (req, res) => {
  res.redirect(req.get('Referrer') || '/')
})
```

<h4 id="res.send.body">res.send(body, status)</h4>

Express 5 no longer supports the signature `res.send(obj, status)`. Instead, set the status and then chain it to the `res.send()` method like this: `res.status(status).send(obj)`.

```js
// v4
app.get('/user', (req, res) => {
  res.send({ name: 'Ruben' }, 200)
})

// v5
app.get('/user', (req, res) => {
  res.status(200).send({ name: 'Ruben' })
})
```

<h4 id="res.send.status">res.send(status)</h4>

Express 5 unterstützt die Signatur <code>res.send(<em>status</em>)</code>, nicht mehr, wobei _`status`_ für eine Zahl steht. Verwenden Sie stattdessen die Funktion `res.sendStatus(statusCode)`, mit der der Statuscode für den HTTP-Antwort-Header festgelegt und die Textversion des Codes gesendet wird: "Not Found" (Nicht gefunden), "Internal Server Error" (Interner Serverfehler) usw.
Wenn Sie eine Zahl senden und hierfür die Funktion `res.send()` verwenden müssen, müssen Sie die Zahl in Anführungszeichen setzen, um diese in eine Zeichenfolge zu konvertieren. Dadurch interpretiert Express diese Zahl nicht als Versuch, die nicht mehr unterstützte alte Signatur zu verwenden.

```js
// v4
app.get('/user', (req, res) => {
  res.send(200)
})

// v5
app.get('/user', (req, res) => {
  res.sendStatus(200)
})
```

<h4 id="res.sendfile">res.sendfile()</h4>

Die Funktion `res.sendfile()` wurde durch eine Version in Camel-Schreibweise von `res.sendFile()` in Express 5 ersetzt.

```js
// v4
app.get('/user', (req, res) => {
  res.sendfile('/path/to/file')
})

// v5
app.get('/user', (req, res) => {
  res.sendFile('/path/to/file')
})
```

<h3>Geändert</h3>

<h4 id="path-syntax">Path route matching syntax</h4>

Path route matching syntax is when a string is supplied as the first parameter to the `app.all()`, `app.use()`, `app.METHOD()`, `router.all()`, `router.METHOD()`, and `router.use()` APIs. The following changes have been made to how the path string is matched to an incoming request:

- The wildcard `*` must have a name, matching the behavior of parameters `:`, use `/*splat` instead of `/*`

```js
// v4
app.get('/*', async (req, res) => {
  res.send('ok')
})

// v5
app.get('/*splat', async (req, res) => {
  res.send('ok')
})
```

{% capture note_wildcard %}
`*splat` matches any path without the root path. If you need to match the root path as well `/`, you can use `/{*splat}`, wrapping the wildcard in braces.

```js
// v5
app.get('/{*splat}', async (req, res) => {
  res.send('ok')
})
```

{% endcapture %}
{% include admonitions/note.html content=note_wildcard %}

- The optional character `?` is no longer supported, use braces instead.

```js
// v4
app.get('/:file.:ext?', async (req, res) => {
  res.send('ok')
})

// v5
app.get('/:file{.:ext}', async (req, res) => {
  res.send('ok')
})
```

- Regexp characters are not supported. For example:

```js
app.get('/[discussion|page]/:slug', async (req, res) => {
  res.status(200).send('ok')
})
```

should be changed to:

```js
app.get(['/discussion/:slug', '/page/:slug'], async (req, res) => {
  res.status(200).send('ok')
})
```

- Some characters have been reserved to avoid confusion during upgrade (`()[]?+!`), use `\` to escape them.
- Parameter names now support valid JavaScript identifiers, or quoted like `:"this"`.

<h4 id="rejected-promises">Rejected promises handled from middleware and handlers</h4>

Request middleware and handlers that return rejected promises are now handled by forwarding the rejected value as an `Error` to the error handling middleware. This means that using `async` functions as middleware and handlers are easier than ever. When an error is thrown in an `async` function or a rejected promise is `await`ed inside an async function, those errors will be passed to the error handler as if calling `next(err)`.

Details of how Express handles errors is covered in the [error handling documentation](/en/guide/error-handling.html).

<h4 id="express.urlencoded">express.urlencoded</h4>

The `express.urlencoded` method makes the `extended` option `false` by default.

<h4 id="app.listen">app.listen</h4>

In Express 5, the `app.listen` method will invoke the user-provided callback function (if provided) when the server receives an error event. In Express 4, such errors would be thrown. This change shifts error-handling responsibility to the callback function in Express 5. If there is an error, it will be passed to the callback as an argument.
For example:

```js
const server = app.listen(8080, '0.0.0.0', (error) => {
  if (error) {
    throw error // e.g. EADDRINUSE
  }
  console.log(`Listening on ${JSON.stringify(server.address())}`)
})
```

<h4 id="app.router">app.router</h4>

Das Objekt `app.router`, das in Express 4 entfernt wurde, ist in Express 5 wieder verfügbar. In der neuen Version fungiert dieses Objekt nur als Referenz zum Express-Basisrouter – im Gegensatz zu Express 3, wo die Anwendung dieses Objekt explizit laden musste.

<h4 id="req.body">req.body</h4> 

The `req.body` property returns `undefined` when the body has not been parsed. In Express 4, it returns `{}` by default.

<h4 id="req.host">req.host</h4>

In Express 4 übergab die Funktion `req.host` nicht ordnungsgemäß eine eventuell vorhandene Portnummer. In Express 5 wird die Portnummer beibehalten.

<h4 id="req.query">req.query</h4>

The `req.query` property is no longer a writable property and is instead a getter. The default query parser has been changed from "extended" to "simple".

<h4 id="res.clearCookie">res.clearCookie</h4>

The `res.clearCookie` method ignores the `maxAge` and `expires` options provided by the user.

<h4 id="res.status">res.status</h4>

The `res.status` method only accepts integers in the range of `100` to `999`, following the behavior defined by Node.js, and it returns an error when the status code is not an integer.

<h4 id="res.query">res.vary</h4>

The `res.vary` throws an error when the `field` argument is missing. In Express 4, if the argument was omitted, it gave a warning in the console

### Verbesserungen

<h4 id="res.render">res.render()</h4>

Diese Methode erzwingt nun asynchrones Verhalten für alle View-Engines, sodass durch View-Engines mit synchroner Implementierung verursachte Fehler vermieden werden, durch die die empfohlene Schnittstelle nicht verwendet werden konnte.

<h4 id="brotli-support">Brotli encoding support</h4>

Express 5 supports Brotli encoding for requests received from clients that support it.
