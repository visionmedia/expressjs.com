---
layout: page
title: Написание кода промежуточных обработчиков для использования в приложениях Express
description: Learn how to write custom middleware functions for Express.js applications, including examples and best practices for enhancing request and response handling.
menu: guide
lang: ru
redirect_from: /guide/writing-middleware.html
---

# Написание кода промежуточных обработчиков для использования в приложениях Express

<h2>Обзор</h2>

Функции _промежуточной обработки_ (middleware) - это функции, имеющие доступ к [объекту запроса](/{{ page.lang }}/4x/api.html#req)  (`req`), [объекту ответа](/{{ page.lang }}/4x/api.html#res) (`res`) и к следующей функции промежуточной обработки в цикле "запрос-ответ" приложения. Следующая функция промежуточной обработки, как правило, обозначается переменной `next`.

Функции промежуточной обработки могут выполнять следующие задачи:

- Выполнение любого кода.
- Внесение изменений в объекты запросов и ответов.
- Завершение цикла "запрос-ответ".
- Вызов следующего промежуточного обработчика из стека.

Если текущая функция промежуточной обработки не завершает цикл "запрос-ответ", она должна вызвать `next()` для передачи управления следующей функции промежуточной обработки. В противном случае запрос зависнет.

Ниже представлены элементы вызова функции промежуточного обработчика:

<table id="mw-fig">
<tbody><tr><td id="mw-fig-imgcell">
<img src="/images/express-mw.png" id="mw-fig-img" />
</td>
<td class="mw-fig-callouts">
<div class="callout" id="callout1">Метод HTTP, к которому применяется данный промежуточный обработчик.</div></tbody>

<div class="callout" id="callout2">Путь (маршрут), к которому применяется данный промежуточный обработчик.</div>

<div class="callout" id="callout3">Функция промежуточного обработчика.</div>

<div class="callout" id="callout4">Аргумент обратного вызова для функции промежуточного обработчика, именуемый "next" согласно стандарту.</div>

<div class="callout" id="callout5">Аргумент <a href="../4x/api.html#res">ответа</a> HTTP, именуемый "res" согласно стандарту.</div>

<div class="callout" id="callout6">Аргумент <a href="../4x/api.html#req">запроса</a> HTTP, именуемый "req" согласно стандарту.</div>
</td></tr>
</table>

Starting with Express 5, middleware functions that return a Promise will call `next(value)` when they reject or throw an error. `next` will be called with either the rejected value or the thrown Error.

<h2>Example</h2>

Далее приводится пример простого приложения Ниже Express "Hello World", для которого будут определены две функции промежуточных обработчиков:
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
Ниже приводится простой пример промежуточного обработчика "myLogger". Эта функция печатает слово "LOGGED" при прохождении запроса, адресованного приложению, через приложение. Данная функция промежуточного обработчика присвоена переменной с именем `myLogger`.

```js
const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}
```

<div class="doc-box doc-notice" markdown="1">
Обратите внимание на вызов `next()` выше. Вызов этой функции активирует следующую функцию промежуточной обработки в приложении.
Функция `next()` не является частью Node.js или Express API, но представляет собой третий аргумент, передаваемый в функцию промежуточного обработчика. Функция `next()` могла бы иметь любое имя, но, согласно стандарту, она всегда называется "next".
Во избежание путаницы, рекомендуется всегда придерживаться данного стандарта.
</div>

Для того чтобы загрузить функцию промежуточного обработчика вызовите `app.use()` с указанием соответствующей функции.
Например, приведенный ниже код загружает функцию промежуточного обработчика `myLogger` перед маршрутом к корневому расположению (/).

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

Каждый раз при получении запроса приложение выводит на терминал сообщение "LOGGED".

Порядок загрузки промежуточных обработчиков очень важен: функции промежуточных обработчиков, загруженные первыми, выполняются в первую очередь.

Если `myLogger` загружается после маршрута к корневому расположению, запрос никогда не достигает его, и приложением не выводится сообщение "LOGGED", поскольку обработчик маршрута корневого пути завершает цикл "запрос-ответ".

Промежуточный обработчик `myLogger` всего лишь выводит сообщение, затем передает запрос далее, следующему промежуточному обработчику в стеке, путем вызова функции `next()`.

<h3>Middleware function requestTime</h3>

В следующем примере выполняется добавление свойства `requestTime` в объект запроса. Назовем эту функцию промежуточного обработчика "requestTime".

```js
const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}
```

Теперь приложением используется функция промежуточного обработчика `requestTime`. Кроме того, функция обратного вызова маршрута корневого расположения (пути) использует свойство, добавленную функций промежуточного обработчика в `req` (объект запроса).

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

Если запрос адресован корневому каталогу приложения, приложение выводит на экран системное время запроса в браузере.

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

Благодаря наличию доступа к объекту запроса, объекту ответа, следующей функции промежуточного обработчика в стеке и к API Node.js в целом, возможности, связанные с промежуточными обработчиками, являются бесконечными.

Дополнительная информация о промежуточных обработчиках Express содержится в разделе  [Использование промежуточных обработчиков Express](/{{ page.lang }}/guide/using-middleware.html).

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
