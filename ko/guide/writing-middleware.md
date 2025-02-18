---
layout: page
title: Express 앱에서 사용하기 위한 미들웨어 작성
description: Learn how to write custom middleware functions for Express.js applications, including examples and best practices for enhancing request and response handling.
menu: guide
lang: ko
redirect_from: /guide/writing-middleware.html
---

# Express 앱에서 사용하기 위한 미들웨어 작성

<h2>개요</h2>

_미들웨어_ 함수는 [요청 오브젝트](/{{ page.lang }}/4x/api.html#req)(`req`), [응답 오브젝트](/{{ page.lang }}/4x/api.html#res) (`res`), 그리고 애플리케이션의 요청-응답 주기 중 그 다음의 미들웨어 함수 대한 액세스 권한을 갖는 함수입니다. 그 다음의 미들웨어 함수는 일반적으로 `next`라는 이름의 변수로 표시됩니다.

미들웨어 함수는 다음과 같은 태스크를 수행할 수 있습니다.

- 모든 코드를 실행.
- 요청 및 응답 오브젝트에 대한 변경을 실행.
- 요청-응답 주기를 종료.
- 스택 내의 그 다음 미들웨어를 호출.

현재의 미들웨어 함수가 요청-응답 주기를 종료하지 않는 경우에는 `next()`를 호출하여 그 다음 미들웨어 함수에 제어를 전달해야 합니다. 그렇지 않으면 해당 요청은 정지된 채로 방치됩니다.

다음 예시에 미들웨어 함수 호출의 요소가 표시되어 있습니다.

<table id="mw-fig">
<tbody><tr><td id="mw-fig-imgcell">
<img src="/images/express-mw.png" id="mw-fig-img" />
</td>
<td class="mw-fig-callouts">
<div class="callout" id="callout1">미들웨어 함수가 적용되는 HTTP 메소드.</div></tbody>

<div class="callout" id="callout2">미들웨어 함수가 적용되는 경로(라우트).</div>

<div class="callout" id="callout3">미들웨어 함수.</div>

<div class="callout" id="callout4">미들웨어 함수에 대한 콜백 인수(일반적으로 "next"라 불림).</div>

<div class="callout" id="callout5">미들웨어 함수에 대한 HTTP <a href="../4x/api.html#res">응답</a> 인수(일반적으로 "res"라 불림).</div>

<div class="callout" id="callout6">미들웨어 함수에 대한 HTTP <a href="../4x/api.html#req">요청</a> 인수(일반적으로 "req"라 불림).</div>
</td></tr>
</table>

Starting with Express 5, middleware functions that return a Promise will call `next(value)` when they reject or throw an error. `next` will be called with either the rejected value or the thrown Error.

<h2>Example</h2>

아래에는 간단한 "Hello World" Express 애플리케이션에 대한 예가 표시되어 있으며, 이 애플리케이션을 위해 두 개의 미들웨어 함수를 정의하게 됩니다.
The remainder of this article will define and add three middleware functions to the application:
one called `myLogger` that prints a simple log message, one called `requestTime` that
displays the timestamp of the HTTP request, and one called `validateCookies` that validates incoming cookies.

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)
```

<h3>Middleware function myLogger</h3>
아래에는 "myLogger"라는 이름의 미들웨어 함수에 대한 간단한 예가 표시되어 있습니다. 이 함수는 앱에 대한 요청이 해당 함수를 거쳐 전달될 때 단순히 "LOGGED"를 인쇄합니다. 이 미들웨어 함수는 `myLogger`라는 이름의 변수에 지정되어 있습니다.

```js
const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}
```

<div class="doc-box doc-notice" markdown="1">
위의 예에서 `next()`에 대한 호출에 주목하십시오. 이 함수를 호출하면 앱 내의 그 다음 미들웨어 함수가 호출됩니다.
`next()` 함수는 Node.js 또는 Express API의 일부가 아니지만, 미들웨어 함수에 전달되는 세 번째 인수입니다. `next()` 함수에는 어떠한 이름을 지정해도 좋지만, 일반적으로 항상 "next"라는 이름을 갖습니다.
혼란을 방지하려면 항상 이러한 방식을 사용하십시오.
</div>

미들웨어 함수를 로드하려면 미들웨어 함수를 지정하여 `app.use()`를 호출하십시오.
예를 들면, 다음의 코드는 루트 경로(/)로 라우팅하기 전에 `myLogger` 미들웨어 함수를 로드합니다.

```js
const express = require('express')
const app = express()

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)
```

앱이 요청을 수신할 때마다, 앱은 "LOGGED"라는 메시지를 터미널에 인쇄합니다.

미들웨어의 로드 순서는 중요하며, 먼저 로드되는 미들웨어 함수가 먼저 실행됩니다.

루트 경로에 대한 라우팅 이후에 `myLogger`가 로드되면, 루트 경로의 라우트 핸들러가 요청-응답 주기를 종료하므로 요청은 절대로 `myLogger`에 도달하지 못하며 앱은 "LOGGED"를 인쇄하지 않습니다.

미들웨어 함수 `myLogger`는 단순히 메시지를 인쇄한 후 `next()` 함수를 호출하여 스택 내의 그 다음 미들웨어 함수에 요청을 전달합니다.

<h3>Middleware function requestTime</h3>

다음 예에서는 `requestTime`라는 특성을 요청 오브젝트에 추가합니다. 이 미들웨어 함수는 "requestTime"이라고 명명하겠습니다.

```js
const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}
```

이제 앱은 `requestTime` 미들웨어 함수를 사용합니다. 또한 루트 경로 라우트의 콜백 함수는 미들웨어 함수가 `req`(요청 오브젝트)에 추가하는 특성을 사용합니다.

```js
const express = require('express')
const app = express()

const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText)
})

app.listen(3000)
```

앱의 루트에 대한 요청을 실행할 때, 앱은 이제 요청의 타임스탬프를 브라우저에 표시합니다.

<h3>Middleware function validateCookies</h3>

Finally, we'll create a middleware function that validates incoming cookies and sends a 400 response if cookies are invalid.

Here's an example function that validates cookies with an external async service.

```js
async function cookieValidator (cookies) {
  try {
    await externallyValidateCookie(cookies.testCookie)
  } catch {
    throw new Error('Invalid cookies')
  }
}
```

Here, we use the [`cookie-parser`](/resources/middleware/cookie-parser.html) middleware to parse incoming cookies off the `req` object and pass them to our `cookieValidator` function. The `validateCookies` middleware returns a Promise that upon rejection will automatically trigger our error handler.

```js
const express = require('express')
const cookieParser = require('cookie-parser')
const cookieValidator = require('./cookieValidator')

const app = express()

async function validateCookies (req, res, next) {
  await cookieValidator(req.cookies)
  next()
}

app.use(cookieParser())

app.use(validateCookies)

// error handler
app.use((err, req, res, next) => {
  res.status(400).send(err.message)
})

app.listen(3000)
```

<div class="doc-box doc-notice" markdown="1">
Note how `next()` is called after `await cookieValidator(req.cookies)`. This ensures that if `cookieValidator` resolves, the next middleware in the stack will get called. If you pass anything to the `next()` function (except the string `'route'` or `'router'`), Express regards the current request as being an error and will skip any remaining non-error handling routing and middleware functions.
</div>

사용자는 요청 오브젝트, 응답 오브젝트, 스택 내의 그 다음 미들웨어 함수, 그리고 모든 Node.js API에 대한 액세스 권한을 가지고 있으므로, 미들웨어 함수에 대한 가능성은 끝이 없습니다.

Express 미들웨어에 대한 자세한 정보는 [Express 미들웨어 사용](/{{ page.lang }}/guide/using-middleware.html)을 참조하십시오.

<h2>Configurable middleware</h2>

If you need your middleware to be configurable, export a function which accepts an options object or other parameters, which, then returns the middleware implementation based on the input parameters.

File: `my-middleware.js`

```js
module.exports = function (options) {
  return function (req, res, next) {
    // Implement the middleware function based on the options object
    next()
  }
}
```

The middleware can now be used as shown below.

```js
const mw = require('./my-middleware.js')

app.use(mw({ option1: '1', option2: '2' }))
```

Refer to [cookie-session](https://github.com/expressjs/cookie-session) and [compression](https://github.com/expressjs/compression) for examples of configurable middleware.
