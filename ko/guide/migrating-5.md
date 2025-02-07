---
layout: page
title: Express 5로의 마이그레이션
description: A comprehensive guide to migrating your Express.js applications from version 4 to 5, detailing breaking changes, deprecated methods, and new improvements.
menu: guide
lang: ko
redirect_from: /guide/migrating-5.html
---

# Express 5로의 이전

<h2 id="overview">개요</h2>

Express 5는 Express 4와 크게 다르지 않으며, API에 대한 변경은 3.0에서 4.0으로의 변경만큼 크지 않습니다. 기본적인 API는 동일하게 유지되지만, 근본적인 변경사항이 존재합니다. 즉, Express 5를 사용하기 위해 기존 Express 4 프로그램을 업데이트하면 기존 Express 4 프로그램은 작동하지 않을 수 있습니다.

To install this version, you need to have a Node.js version 18 or higher. Then, execute the following command in your application directory:

```sh
$ npm install "express@^{{ site.data.express.next_version }}" --save
```

이후 자동화된 테스트를 실행하여 실패하는 항목을 확인하고, 아래에 나열된 업데이트에 따라 문제를 수정할 수 있습니다. 테스트 실패 항목을 처리한 후에는 앱을 실행하여 어떠한 오류가 발생하는지 확인하십시오. 지원되지 않는 메소드나 특성을 앱이 사용하는 경우에는 이를 곧바로 확인할 수 있습니다.

<h2 id="changes">Express 5에서의 변경사항</h2>

**제거된 메소드 및 특성**

<ul class="doclist">
  <li><a href="#app.del">app.del()</a></li>
  <li><a href="#app.param">app.param(fn)</a></li>
  <li><a href="#plural">복수형의 메소드 이름</a></li>
  <li><a href="#leading">app.param(name, fn)에 대한 이름(name) 인수의 첫머리 콜론</a></li>
  <li><a href="#req.param">req.param(name)</a></li>
  <li><a href="#res.json">res.json(obj, status)</a></li>
  <li><a href="#res.jsonp">res.jsonp(obj, status)</a></li>
  <li><a href="#magic-redirect">res.redirect('back') and res.location('back')</a></li>  
  <li><a href="#res.redirect">res.redirect(url, status)</a></li>
  <li><a href="#res.send.body">res.send(body, status)</a></li>
  <li><a href="#res.send.status">res.send(status)</a></li>
  <li><a href="#res.sendfile">res.sendfile()</a></li>
</ul>

**개선된 항목**

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

**변경된 항목**

<ul class="doclist">
  <li><a href="#res.render">res.render()</a></li>
  <li><a href="#brotli-support">Brotli encoding support</a></li>
</ul>

### 제거된 메소드 및 특성

앱에서 이러한 메소드 또는 특성 중 어느 하나라도 사용한다면 앱에서 충돌이 발생합니다. 따라서 버전 5로 업데이트한 후에는 앱을 변경해야 합니다.

<h4 id="app.del">app.del()</h4>

Express 5는 `app.del()` 함수를 더 이상 지원하지 않습니다. 이 함수를 사용하면 오류에 대한 예외 처리(throw)가 발생합니다. HTTP DELETE 라우트를 등록하려면 `app.delete()` 함수를 대신 사용하십시오.

`delete`는 JavaScript의 예약된 키워드이므로, 처음에는 `delete` 대신 `del`이 사용되었습니다. 그러나, ECMAScript 6을 기준으로, `delete` 및 다른 예약된 키워드를 정식 특성 이름으로 사용할 수 있게 되었습니다.

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

`app.param(fn)` 시그니처는 `app.param(name, fn)` 함수의 작동을 수정하는 데 사용되었습니다. 이 시그니처는 v4.11.0 이후 더 이상 사용되지 않았으며 Express 5에서는 전혀 지원되지 않습니다.

<h4 id="plural">복수형의 메소드 이름</h4>

다음과 같은 메소드 이름은 이제 복수형이 되었습니다. Express 4에서는 구버전의 메소드를 사용하면 사용 중단 경고가 표시되었습니다. Express 5는 구버전의 메소드를 전혀 지원하지 않습니다.

`req.acceptsLanguage()`는 `req.acceptsLanguages()`로 대체되었습니다.

`req.acceptsCharset()`는 `req.acceptsCharsets()`로 대체되었습니다.

`req.acceptsEncoding()`은 `req.acceptsEncodings()`로 대체되었습니다.

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

<h4 id="leading">app.param(name, fn)에 대한 이름(name)의 첫머리 콜론(:)</h4>

`app.param(name, fn)` 함수의 이름(name)의 첫머리 콜론 문자(:)는 Express 3의 잔존물이며, 하위 호환성을 위해 Express 4에서는 첫머리 콜론을 지원하면서 사용 중단 알림을 표시했습니다. Express 5는 아무런 메시지 표시 없이 첫머리 콜론을 무시하며, 콜론을 이용한 접두부가 없는 이름 매개변수를 사용합니다.

[app.param](/{{ page.lang }}/4x/api.html#app.param)에 대한 Express 4 문서에는 첫머리 콜론이 언급되어 있지 않으므로, 이 문서를 따라 앱을 작성한 경우에는 이 변경사항이 코드에 영향을 미치지 않을 것입니다.

<h4 id="req.param">req.param(name)</h4>

양식 데이터 검색을 위한 이 메소드는 혼란과 위험을 발생시킬 수 있으므로 제거되었습니다. 이제는 `req.params`, `req.body` 또는 `req.query` 오브젝트에서 제출된 매개변수 이름을 구체적으로 확인해야 합니다.

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

Express 5는 `res.json(obj, status)` 시그니처를 더 이상 지원하지 않습니다. 대신, 상태를 설정한 후 이를 `res.status(status).json(obj)`과 같은 `res.json()` 메소드에 체인해야 합니다.

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

Express 5는 `res.jsonp(obj, status)` 시그니처를 더 이상 지원하지 않습니다. 대신, 상태를 설정한 후 이를 `res.status(status).jsonp(obj)`와 같은 `res.jsonp()` 메소드에 체인해야 합니다.

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

Express 5는 `res.send(obj, status)` 시그니처를 더 이상 지원하지 않습니다. 대신, 상태를 설정한 후 이를 `res.status(status).send(obj)`와 같은 `res.send()` 메소드에 체인해야 합니다.

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

Express 5는 \*`status`\*가 숫자인 <code>res.send(<em>status</em>)</code> 시그니처를 더 이상 지원하지 않습니다. 대신, HTTP 응답 헤더 상태 코드를 설정하고 해당 코드의 텍스트 버전("Not Found", "Internal Server Error" 등)을 전송하는 `res.sendStatus(statusCode)` 함수를 사용해야 합니다.
`res.send()` 함수를 이용해 숫자를 전송해야 하는 경우, Express가 그 숫자를 지원되지 않는 구버전 시그니처 사용 시도로 해석하지 않도록 숫자의 앞뒤에 따옴표를 추가하여 숫자를 문자열로 변환하십시오.

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

Express 5에서 `res.sendfile()` 함수는 낙타 대문자(camel-cased) 버전인 `res.sendFile()`로 대체되었습니다.

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

<h3>변경된 항목</h3>

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

Express 4에서 제거되었던 `app.router` 오브젝트가 Express 5에 되돌아왔습니다. Express 3에서는 앱이 이 오브젝트를 명시적으로 로드해야 했던 것과 달리, 새 버전에서 이 오브젝트는 단순히 기본 Express 라우터에 대한 참조의 역할을 합니다.

<h4 id="req.body">req.body</h4> 

The `req.body` property returns `undefined` when the body has not been parsed. In Express 4, it returns `{}` by default.

<h4 id="req.host">req.host</h4>

Express 4에서, 포트 번호가 존재하는 경우 `req.host` 함수는 포트 번호를 올바르지 않게 제거했습니다. Express 5에서는 포트 번호가 유지됩니다.

<h4 id="req.query">req.query</h4>

The `req.query` property is no longer a writable property and is instead a getter. The default query parser has been changed from "extended" to "simple".

<h4 id="res.clearCookie">res.clearCookie</h4>

The `res.clearCookie` method ignores the `maxAge` and `expires` options provided by the user.

<h4 id="res.status">res.status</h4>

The `res.status` method only accepts integers in the range of `100` to `999`, following the behavior defined by Node.js, and it returns an error when the status code is not an integer.

<h4 id="res.query">res.vary</h4>

The `res.vary` throws an error when the `field` argument is missing. In Express 4, if the argument was omitted, it gave a warning in the console

### 개선된 항목

<h4 id="res.render">res.render()</h4>

이 메소드는 이제 모든 보기 엔진에 대해 비동기식 작동을 적용하며, 동기식 구현을 갖는 보기 엔진 및 권장되는 인터페이스를 위반하는 보기 엔진에 의한 버그의 발생을 방지합니다.

<h4 id="brotli-support">Brotli encoding support</h4>

Express 5 supports Brotli encoding for requests received from clients that support it.
