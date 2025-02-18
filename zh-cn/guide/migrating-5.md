---
layout: page
title: 迁移到 Express 5
description: A comprehensive guide to migrating your Express.js applications from version 4 to 5, detailing breaking changes, deprecated methods, and new improvements.
menu: guide
lang: en
redirect_from: /guide/migrating-5.html
---

# 迁移到 Express 5

<h2 id="overview">概述</h2>

Express 5 与 Express 4 的差异不是很大：对 API 的更改不像 3.0 到 4.0 升级那样大刀阔斧。虽然基本 API 保持相同，但仍有一些重大更改；换言之，如果将现有 Express 4 程序更新为使用 Express 5，那么该程序可能无法工作。 Therefore, an application built with Express 4 might not work if you update it to use Express 5.

To install this version, you need to have a Node.js version 18 or higher. Then, execute the following command in your application directory:

```sh
$ npm install "express@^{{ site.data.express.next_version }}" --save
```

随后，可以运行自动化测试以查看哪些地方发生故障，然后根据以下列出的更新修复问题。在解决测试故障问题之后，运行应用程序以查看发生哪些错误。如果应用程序使用任何不受支持的方法或属性，您马上就可以发现。 After addressing test failures, run your app to see what errors occur. You'll find out right away if the app uses any methods or properties that are not supported.

<h2 id="changes">Express 5 中的更改</h2>

**已移除的方法和属性**

<ul class="doclist">
  <li><a href="#app.del">app.del()</a></li>
  <li><a href="#app.param">app.param(fn)</a></li>
  <li><a href="#plural">复数的方法名称</a></li>
  <li><a href="#leading">app.param(name, fn) 的 name 自变量中的前置冒号</a></li>
  <li><a href="#req.param">req.param(name)</a></li>
  <li><a href="#res.json">res.json(obj, status)</a></li>
  <li><a href="#res.jsonp">res.jsonp(obj, status)</a></li>
  <li><a href="#magic-redirect">res.redirect('back') and res.location('back')</a></li>  
  <li><a href="#res.redirect">res.redirect(url, status)</a></li>
  <li><a href="#res.send.body">res.send(body, status)</a></li>
  <li><a href="#res.send.status">res.send(status)</a></li>
  <li><a href="#res.sendfile">res.sendfile()</a></li>
  <li><a href="#express.static.mime">express.static.mime</a></li>
</ul>

**改进**

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

**已更改**

<ul class="doclist">
  <li><a href="#res.render">res.render()</a></li>
  <li><a href="#brotli-support">Brotli encoding support</a></li>
</ul>

### 已移除的方法和属性

If you use any of these methods or properties in your app, it will crash. So, you'll need to change your app after you update to version 5.

<h4 id="app.del">app.del()</h4>

Express 5 不再支持 `app.del()` 函数。如果使用此函数，将抛出错误。要注册 HTTP DELETE 路由，请使用 `app.delete()` 函数。 If you use this function, an error is thrown. For registering HTTP DELETE routes, use the `app.delete()` function instead.

最初之所以使用 `del` 而不是 `delete`，是因为 `delete` 是 JavaScript 中的保留关键字。但在 ECMAScript 6 时，`delete` 和其他保留关键字可以合法地用作属性名称。您可以在此阅读该讨论，这导致我们在此不推荐使用 `app.del` 函数。 However, as of ECMAScript 6, `delete` and other reserved keywords can legally be used as property names.

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

`app.param(fn)` 特征符用于修改 `app.param(name, fn)` 函数的行为。自 V4.11.0 起不推荐使用该特征符，而 Express 5 完全不再提供支持。 It has been deprecated since v4.11.0, and Express 5 no longer supports it at all.

<h4 id="plural">复数的方法名称</h4>

The following method names have been pluralized. In Express 4, using the old methods resulted in a deprecation warning. Express 5 no longer supports them at all:

`req.acceptsLanguage()` 由 `req.acceptsLanguages()` 取代。

`req.acceptsCharset()` 由 `req.acceptsCharsets()` 取代。

`req.acceptsEncoding()` 由 `req.acceptsEncodings()` 取代。

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

<h4 id="leading">app.param(name, fn) 的名称中的前置冒号 (:)</h4>

`app.param(name, fn)` 函数名称中的前置冒号字符 (:) 是 Express 3 的遗留问题，为了向后兼容性，Express 4 提供支持但会显示不推荐使用的提醒。而 Express 5 则静默忽略它，使用不带前置冒号的名称参数。 Express 5 will silently ignore it and use the name parameter without prefixing it with a colon.

如果您遵循 [app.param](/{{ page.lang }}/4x/api.html#app.param) 的 Express 4 文档进行开发，那么不会影响代码，因为文档中没有提及前置冒号。

<h4 id="req.param">req.param(name)</h4>

This potentially confusing and dangerous method of retrieving form data has been removed. 已移除用于检索表单数据的方法，因为这可能引起混淆，而且很危险。现在，您需要在 `req.params`、`req.body` 或 `req.query` 对象中专门寻找提交的参数名称。

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

Express 5 不再支持特征符 `res.json(obj, status)`。而是设置状态，然后将其链接到 `res.json()` 方法，如下所示：`res.status(status).json(obj)`。 Instead, set the status and then chain it to the `res.json()` method like this: `res.status(status).json(obj)`.

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

Express 5 不再支持特征符 `res.jsonp(obj, status)`。而是设置状态，然后将其链接到 `res.jsonp()` 方法，如下所示：`res.status(status).jsonp(obj)`。 Instead, set the status and then chain it to the `res.jsonp()` method like this: `res.status(status).jsonp(obj)`.

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

Express 5 no longer supports the signature `res.redirect(url, status)`. Instead, use the following signature: `res.redirect(status, url)`.

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

Express 5 不再支持特征符 `res.send(obj, status)`。而是设置状态，然后将其链接到 `res.send()` 方法，如下所示：`res.status(status).send(obj)`。 Instead, set the status and then chain it to the `res.send()` method like this: `res.status(status).send(obj)`.

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

Express 5 no longer supports the signature `res.send(status)`, where `status` is a number. Instead, use the `res.sendStatus(statusCode)` function, which sets the HTTP response header status code and sends the text version of the code: "Not Found", "Internal Server Error", and so on.
If you need to send a number by using the `res.send()` function, quote the number to convert it to a string, so that Express does not interpret it as an attempt to use the unsupported old signature.

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

在 Express 5 中，`res.sendfile()` 函数已由驼峰式大小写版本 `res.sendFile()` 替换。

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

<h4 id="express.static.mime">express.static.mime</h4>

In Express 5, `mime` is no longer an exported property of the `static` field.
Use the [`mime-types` package](https://github.com/jshttp/mime-types) to work with MIME type values.

```js
// v4
express.static.mime.lookup('json')

// v5
const mime = require('mime-types')
mime.lookup('json')
```

<h3>已更改</h3>

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

在 Express 4 中已移除的 `app.router` 对象在 Express 5 中已恢复。在新版本中，此对象只是对 Express 基本路由器的引用，不像在 Express 3 中应用程序必须显式将该路由器装入。 In the new version, this object is a just a reference to the base Express router, unlike in Express 3, where an app had to explicitly load it.

<h4 id="req.body">req.body</h4> 

The `req.body` property returns `undefined` when the body has not been parsed. In Express 4, it returns `{}` by default.

<h4 id="req.host">req.host</h4>

在 Express 4 中，如果存在端口号，`req.host` 函数会错误地将其剥离。在 Express 5 中，则会保留端口号。 In Express 5, the port number is maintained.

<h4 id="req.query">req.query</h4>

The `req.query` property is no longer a writable property and is instead a getter. The default query parser has been changed from "extended" to "simple".

<h4 id="res.clearCookie">res.clearCookie</h4>

The `res.clearCookie` method ignores the `maxAge` and `expires` options provided by the user.

<h4 id="res.status">res.status</h4>

The `res.status` method only accepts integers in the range of `100` to `999`, following the behavior defined by Node.js, and it returns an error when the status code is not an integer.

<h4 id="res.query">res.vary</h4>

The `res.vary` throws an error when the `field` argument is missing. In Express 4, if the argument was omitted, it gave a warning in the console

### 改进

<h4 id="res.render">res.render()</h4>

现在，此方法为所有查看引擎强制执行异步行为，避免具有同步实现以及违反建议接口的查看引擎所导致的错误。

<h4 id="brotli-support">Brotli encoding support</h4>

Express 5 supports Brotli encoding for requests received from clients that support it.
