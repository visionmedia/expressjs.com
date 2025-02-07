---
layout: page
title: 移轉至 Express 5
description: A comprehensive guide to migrating your Express.js applications from version 4 to 5, detailing breaking changes, deprecated methods, and new improvements.
menu: guide
lang: zh-tw
redirect_from: /guide/migrating-5.html
---

# 移至 Express 5

<h2 id="overview">概觀</h2>

Express 5 與 Express 4 之間差異不大：API 的變更不會像從 3.0 至 4.0 那樣顯著。雖然基本 API 維持相同，仍有一些突破性變更；換句話說，如果您更新成使用 Express 5，現有 Express 4 程式可能無法運作。 Therefore, an application built with Express 4 might not work if you update it to use Express 5.

To install this version, you need to have a Node.js version 18 or higher. Then, execute the following command in your application directory:

```sh
$ npm install "express@^{{ site.data.express.next_version }}" --save
```

然後您可以執行自動化測試，查看失敗之處，並根據下方列出的更新項目來修正問題。解決測試失敗之後，請執行您的應用程式，查看發生哪些錯誤。只要應用程式使用任何不支援的方法或內容，您會馬上發現。 After addressing test failures, run your app to see what errors occur. You'll find out right away if the app uses any methods or properties that are not supported.

<h2 id="changes">Express 5 中的變更</h2>

**已移除的方法和內容**

<ul class="doclist">
  <li><a href="#app.del">app.del()</a></li>
  <li><a href="#app.param">app.param(fn)</a></li>
  <li><a href="#plural">複數化的方法名稱</a></li>
  <li><a href="#leading">Leading colon in name argument to app.param(name, fn)</a></li>
  <li><a href="#req.param">req.param(name)</a></li>
  <li><a href="#res.json">res.json(obj, status)</a></li>
  <li><a href="#res.jsonp">res.jsonp(obj, status)</a></li>
  <li><a href="#magic-redirect">res.redirect('back') and res.location('back')</a></li>  
  <li><a href="#res.redirect">res.redirect(url, status)</a></li>
  <li><a href="#res.send.body">res.send(body, status)</a></li>
  <li><a href="#res.send.status">res.send(status)</a></li>
  <li><a href="#res.sendfile">res.sendfile()</a></li>
</ul>

**改良**

<ul class="doclist">
  <li><a href="#path-syntax">Path route matching syntax</a></li>
  <li><a href="#rejected-promises">Rejected promises handled from middleware and handlers</a></li>
  <li><a href="#express.urlencoded">express.urlencoded</a></li>
  <li><a href="#leading">app.param(name, fn) 名稱引數中的前導冒號</a></li>
  <li><a href="#app.router">app.router</a></li>
  <li><a href="#req.body">req.body</a></li>
  <li><a href="#req.host">req.host</a></li>
  <li><a href="#req.query">req.query</a></li>
  <li><a href="#res.clearCookie">res.clearCookie</a></li>
  <li><a href="#res.status">res.status</a></li>
  <li><a href="#res.vary">res.vary</a></li>
</ul>

**已變更**

<ul class="doclist">
  <li><a href="#res.render">res.render()</a></li>
  <li><a href="#brotli-support">Brotli encoding support</a></li>
</ul>

### 已移除的方法和內容

If you use any of these methods or properties in your app, it will crash. So, you'll need to change your app after you update to version 5.

<h4 id="app.del">app.del()</h4>

Express 5 no longer supports the `app.del()` function. If you use this function, an error is thrown. For registering HTTP DELETE routes, use the `app.delete()` function instead.

最初是使用 `del` 而非 `delete`，因為 `delete` 是 JavaScript 中的保留關鍵字。不過，從 ECMAScript 6 起，`delete` 和其他保留關鍵字可以合法作為內容名稱。您可以在這裡閱讀導致淘汰 `app.del` 函數的相關討論。 However, as of ECMAScript 6, `delete` and other reserved keywords can legally be used as property names.

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

The `app.param(fn)` signature was used for modifying the behavior of the `app.param(name, fn)` function. It has been deprecated since v4.11.0, and Express 5 no longer supports it at all.

<h4 id="plural">Pluralized method names</h4>

The following method names have been pluralized. In Express 4, using the old methods resulted in a deprecation warning. Express 5 no longer supports them at all:

`req.acceptsLanguage()` 以 `req.acceptsLanguages()` 取代。

`req.acceptsCharset()` 以 `req.acceptsCharsets()` 取代。

`req.acceptsEncoding()` 以 `req.acceptsEncodings()` 取代。

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

<h4 id="leading">app.param(name, fn) 名稱中的前導冒號 (:)</h4>

`app.param(name, fn)` 函數名稱中的前導冒號字元 (:) 遺留自 Express 3，基於舊版相容性，Express 4 仍支援它，只是會發出淘汰警示。Express 5 會無聲自動忽略它，並使用少了冒號字首的名稱參數。 Express 5 will silently ignore it and use the name parameter without prefixing it with a colon.

如果您遵循 Express 4 [app.param](/{{ page.lang }}/4x/api.html#app.param) 說明文件，應該不會影響您的程式碼，因為該說明文件不會提及前導冒號。

<h4 id="req.param">req.param(name)</h4>

This potentially confusing and dangerous method of retrieving form data has been removed. You will now need to specifically look for the submitted parameter name in the `req.params`, `req.body`, or `req.query` object.

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

Express 5 不再支援 `res.json(obj, status)` 簽章。請改以設定狀態，然後與 `res.json()` 方法鏈接，如下所示：`res.status(status).json(obj)`。 Instead, set the status and then chain it to the `res.json()` method like this: `res.status(status).json(obj)`.

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

Express 5 不再支援 `res.jsonp(obj, status)` 簽章。請改以設定狀態，然後與 `res.jsonp()` 方法鏈接，如下所示：`res.status(status).jsonp(obj)`。 Instead, set the status and then chain it to the `res.jsonp()` method like this: `res.status(status).jsonp(obj)`.

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

Express 5 不再支援 `res.send(obj, status)` 簽章。請改以設定狀態，然後與 `res.send()` 方法鏈接，如下所示：`res.status(status).send(obj)`。 Instead, set the status and then chain it to the `res.send()` method like this: `res.status(status).send(obj)`.

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

Express 5 不再支援 <code>res.send(<em>status</em>)</code> 簽章，其中 _`status`_ 是數字。請改用 `res.sendStatus(statusCode)` 函數，此函數是設定 HTTP 回應標頭狀態碼，並傳送文字版的程式碼：「找不到」、「內部伺服器錯誤」等。
如果您需要使用 `res.send()` 函數來傳送數字，請將數字括上引號來轉換成字串，這樣 Express 就不會解譯它以試圖使用不支援的舊簽章。 Instead, use the `res.sendStatus(statusCode)` function, which sets the HTTP response header status code and sends the text version of the code: "Not Found", "Internal Server Error", and so on.
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

`res.sendfile()` 函數已被 Express 5 中的駝峰式大小寫版本 `res.sendFile()` 取代。

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

<h3>已變更</h3>

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

`app.router` 物件已在 Express 4 中移除，在 Express 5 中又重新納入。
在新版本中，這個物件只用來參照至基本 Express 路由器，不像在 Express 3 中，應用程式還得明確載入它。 In the new version, this object is a just a reference to the base Express router, unlike in Express 3, where an app had to explicitly load it.

<h4 id="req.body">req.body</h4> 

The `req.body` property returns `undefined` when the body has not been parsed. In Express 4, it returns `{}` by default.

<h4 id="req.host">req.host</h4>

In Express 4, the `req.host` function incorrectly stripped off the port number if it was present. In Express 5, the port number is maintained.

<h4 id="req.query">req.query</h4>

The `req.query` property is no longer a writable property and is instead a getter. The default query parser has been changed from "extended" to "simple".

<h4 id="res.clearCookie">res.clearCookie</h4>

The `res.clearCookie` method ignores the `maxAge` and `expires` options provided by the user.

<h4 id="res.status">res.status</h4>

The `res.status` method only accepts integers in the range of `100` to `999`, following the behavior defined by Node.js, and it returns an error when the status code is not an integer.

<h4 id="res.query">res.vary</h4>

The `res.vary` throws an error when the `field` argument is missing. In Express 4, if the argument was omitted, it gave a warning in the console

### 改良

<h4 id="res.render">res.render()</h4>

此方法現在會針對所有視圖引擎施行非同步行為，可避免採行同步實作及違反建議介面的視圖引擎所造成的錯誤。

<h4 id="brotli-support">Brotli encoding support</h4>

Express 5 supports Brotli encoding for requests received from clients that support it.
