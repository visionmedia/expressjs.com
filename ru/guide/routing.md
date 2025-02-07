---
layout: page
title: Маршрутизация в Express
description: Learn how to define and use routes in Express.js applications, including route methods, route paths, parameters, and using Router for modular routing.
menu: guide
lang: ru
redirect_from: /guide/routing.html
---

# Маршрутизация

_Маршрутизация_ определяет, как приложение отвечает на клиентский запрос к конкретному адресу (URI).
Вводную информацию о маршрутизации можно найти в разделе [Основы маршрутизации](/{{ page.lang }}/starter/basic-routing.html).

You define routing using methods of the Express `app` object that correspond to HTTP methods;
for example, `app.get()` to handle GET requests and `app.post` to handle POST requests. For a full list,
see [app.METHOD](/{{ page.lang }}/5x/api.html#app.METHOD). You can also use [app.all()](/{{ page.lang }}/5x/api.html#app.all) to handle all HTTP methods and [app.use()](/{{ page.lang }}/5x/api.html#app.use) to
specify middleware as the callback function (See [Using middleware](/{{ page.lang }}/guide/using-middleware.html) for details).

These routing methods specify a callback function (sometimes called "handler functions") called when the application receives a request to the specified route (endpoint) and HTTP method. In other words, the application "listens" for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.

In fact, the routing methods can have more than one callback function as arguments.
With multiple callback functions, it is important to provide `next` as an argument to the callback function and then call `next()` within the body of the function to hand off control
to the next callback.

Приведенный ниже код служит примером одного из самых простых маршрутов.

```js
const express = require('express')
const app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})
```

<h2 id="route-methods">Методы Route</h2>

Метод route является производным от одного из методов HTTP и присоединяется к экземпляру класса `express`.

Приведенный ниже код служит примером маршрутов, определенных для методов запросов GET и POST к корневому каталогу приложения.

```js
// GET method route
app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

// POST method route
app.post('/', (req, res) => {
  res.send('POST request to the homepage')
})
```

Express supports methods that correspond to all HTTP request methods: `get`, `post`, and so on.
For a full list, see [app.METHOD](/{{ page.lang }}/5x/api.html#app.METHOD).

Существует особый метод маршрутизации, `app.all()`, не являющийся производным от какого-либо метода HTTP. Этот метод используется для загрузки функций промежуточной обработки в пути для всех методов запросов.

```js
app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})
```

<h2 id="route-paths">Пути маршрутов</h2>

Пути маршрутов, в сочетании с методом запроса, определяют конкретные адреса (конечные точки), в которых могут быть созданы запросы. Пути маршрутов могут представлять собой строки, шаблоны строк или регулярные выражения.

{% capture caution-character %} In express 5, the characters `?`, `+`, `*`, `[]`, and `()` are handled differently than in version 4, please review the [migration guide](/{{ page.lang }}/guide/migrating-5.html#path-syntax) for more information.{% endcapture %}

{% include admonitions/caution.html content=caution-character %}

{% capture note-dollar-character %}In express 4, regular expression characters such as `$` need to be escaped with a `\`.
{% endcapture %}

{% include admonitions/caution.html content=note-dollar-character %}

В Express для сопоставления путей маршрутов используется [path-to-regexp](https://www.npmjs.com/package/path-to-regexp); в документации к path-to-regexp описаны все возможные варианты определения путей маршрутов. [Express Route Tester](http://forbeslindesay.github.io/express-route-tester/) - удобный инструмент для тестирования простых маршрутов в Express, хотя и не поддерживает сопоставление шаблонов.
{% endcapture %}

{% include admonitions/note.html content=note-path-to-regexp %}

{% include admonitions/warning.html content="Query strings are not part of the route path." %}

### Ниже приводятся примеры путей маршрутов на основе строк.

Данный путь маршрута сопоставляет запросы с корневым маршрутом, `/`.

```js
app.get('/', (req, res) => {
  res.send('root')
})
```

Данный путь маршрута сопоставляет запросы с `/about`.

```js
app.get('/about', (req, res) => {
  res.send('about')
})
```

Данный путь маршрута сопоставляет запросы с `/random.text`.

```js
app.get('/random.text', (req, res) => {
  res.send('random.text')
})
```

### Ниже приводятся примеры путей маршрутов на основе шаблонов строк.

{% capture caution-string-patterns %} The string patterns in Express 5 no longer work. Please refer to the [migration guide](/{{ page.lang }}/guide/migrating-5.html#path-syntax) for more information.{% endcapture %}

{% include admonitions/caution.html content=caution-string-patterns %}

Приведенный ниже путь маршрута сопоставляет `acd` и `abcd`.

```js
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd')
})
```

Этот путь маршрута сопоставляет `abcd`, `abbcd`, `abbbcd` и т.д.

```js
app.get('/ab+cd', (req, res) => {
  res.send('ab+cd')
})
```

Этот путь маршрута сопоставляет `abcd`, `abxcd`, `abRABDOMcd`, `ab123cd` и т.д.

```js
app.get('/ab*cd', (req, res) => {
  res.send('ab*cd')
})
```

Данный путь маршрута сопоставляет `/abe` и `/abcde`.

```js
app.get('/ab(cd)?e', (req, res) => {
  res.send('ab(cd)?e')
})
```

### Примеры путей маршрутов на основе регулярных выражений:

Данный путь маршрута сопоставляет любой элемент с "a" в имени маршрута.

```js
app.get(/a/, (req, res) => {
  res.send('/a/')
})
```

Данный маршрут сопоставляет `butterfly` и `dragonfly`, но не `butterflyman`, `dragonfly man` и т.д.

```js
app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/')
})
```

<h2 id="route-parameters">
Строки запросов не являются частью пути маршрута.
</h2>

Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the `req.params` object, with the name of the route parameter specified in the path as their respective keys.

```
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

To define routes with route parameters, simply specify the route parameters in the path of the route as shown below.

```js
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
```

<div class="doc-box doc-notice" markdown="1">
The name of route parameters must be made up of "word characters" ([A-Za-z0-9_]).
</div>

Since the hyphen (`-`) and the dot (`.`) are interpreted literally, they can be used along with route parameters for useful purposes.

```
Route path: /flights/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }
```

```
Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
```

{% capture warning-regexp %}
In express 5, Regexp characters are not supported in route paths, for more information please refer to the [migration guide](/{{ page.lang }}/guide/migrating-5.html#path-syntax).{% endcapture %}

{% include admonitions/caution.html content=warning-regexp %}

To have more control over the exact string that can be matched by a route parameter, you can append a regular expression in parentheses (`()`):

```
Route path: /user/:userId(\d+)
Request URL: http://localhost:3000/user/42
req.params: {"userId": "42"}
```

{% include admonitions/warning.html content="Because the regular expression is usually part of a literal string, be sure to escape any `\` characters with an additional backslash, for example `\\d+`." %}

{% capture warning-version %}
In Express 4.x, <a href="https://github.com/expressjs/express/issues/2495">the `*` character in regular expressions is not interpreted in the usual way</a>. As a workaround, use `{0,}` instead of `*`. This will likely be fixed in Express 5.
{% endcapture %}

{% include admonitions/warning.html content=warning-version %}

<h2 id="route-handlers">Обработчики маршрутов</h2>

Для обработки запроса можно указать несколько функций обратного вызова, подобных [middleware](/{{ page.lang }}/guide/using-middleware.html). Единственным исключением является то, что эти обратные вызовы могут инициировать `next('route')` для обхода остальных обратных вызовов маршрута. С помощью этого механизма можно включить в маршрут предварительные условия, а затем передать управление последующим маршрутам, если продолжать работу с текущим маршрутом не нужно.

Обработчики маршрутов могут принимать форму функции, массива функций или их сочетания, как показано в примерах ниже.

Одна функция обратного вызова может обрабатывать один маршрут. Например:

```js
app.get('/example/a', (req, res) => {
  res.send('Hello from A!')
})
```

Один маршрут может обрабатываться несколькими функциями обратного вызова (обязательно укажите объект `next`). Например:

```js
app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})
```

Массив функций обратного вызова может обрабатывать один маршрут. Например:

```js
const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

const cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])
```

Маршрут может обрабатываться сочетанием независимых функций и массивов функций. Например:

```js
const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from D!')
})
```

<h2 id="response-methods">Методы ответа</h2>

Методы в объекте ответа (`res`), перечисленные в таблице ниже, могут передавать ответ клиенту и завершать цикл "запрос-ответ". Если ни один из этих методов не будет вызван из обработчика маршрута, клиентский запрос зависнет.

| Метод                                                                                                                                                                                                                     | Описание                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [res.download()](/{{ page.lang }}/4x/api.html#res.download)     | Приглашение загрузки файла.                                                                    |
| [res.end()](/{{ page.lang }}/4x/api.html#res.end)               | Завершение процесса ответа.                                                                    |
| [res.json()](/{{ page.lang }}/4x/api.html#res.json)             | Отправка ответа JSON.                                                                          |
| [res.jsonp()](/{{ page.lang }}/4x/api.html#res.jsonp)           | Отправка ответа JSON с поддержкой JSONP.                                                       |
| [res.redirect()](/{{ page.lang }}/4x/api.html#res.redirect)     | Redirect a request.                                                                            |
| [res.render()](/{{ page.lang }}/4x/api.html#res.render)         | Вывод шаблона представления.                                                                   |
| [res.send()](/{{ page.lang }}/4x/api.html#res.send)             | Отправка ответа различных типов.                                                               |
| [res.sendFile](/{{ page.lang }}/4x/api.html#res.sendFile)                          | Отправка файла в виде потока октетов.                                                          |
| [res.sendStatus()](/{{ page.lang }}/4x/api.html#res.sendStatus) | Установка кода состояния ответа и отправка представления в виде строки в качестве тела ответа. |

<h2 id="app-route">app.route()</h2>

Метод `app.route()` позволяет создавать обработчики маршрутов, образующие цепочки, для пути маршрута.
Поскольку путь указан в одном расположении, удобно создавать модульные маршруты, чтобы минимизировать избыточность и количество опечаток. Дополнительная информация о маршрутах приводится в документации [Router()](/{{ page.lang }}/4x/api.html#router).

Ниже приведен пример объединенных в цепочку обработчиков маршрутов, определенных с помощью функции `app.route()`.

```js
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })
```

<h2 id="express-router">express.Router</h2>

С помощью класса `express.Router` можно создавать модульные, монтируемые обработчики маршрутов. Экземпляр `Router` представляет собой комплексную систему промежуточных обработчиков и маршрутизации; по этой причине его часто называют "мини-приложением".

В приведенном ниже примере создается маршрутизатор в виде модуля, в него загружается функция промежуточной обработки, определяется несколько маршрутов, и модуль маршрутизатора монтируется в путь в основном приложении.

Создайте файл маршрутизатора с именем `birds.js` в каталоге приложения со следующим содержанием:

```js
const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page')
})
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router
```

Потом загрузите модуль маршрутизации в приложение:

```js
const birds = require('./birds')

/// ...

app.use('/birds', birds)
```

Данное приложение теперь сможет обрабатывать запросы, адресованные ресурсам `/birds` и
`/birds/about`, а также вызывать специальную функцию промежуточной обработки `timeLog` данного маршрута.

But if the parent route `/birds` has path parameters, it will not be accessible by default from the sub-routes. To make it accessible, you will need to pass the `mergeParams` option to the Router constructor [reference](/{{ page.lang }}/5x/api.html#app.use).

```js
Express поддерживает перечисленные далее методы маршрутизации, соответствующие методам HTTP: `get`, `post`, `put`, `head`, `delete`, `options`, `trace`, `copy`, `lock`, `mkcol`, `move`, `purge`, `propfind`, `proppatch`, `unlock`, `report`, `mkactivity`, `checkout`, `merge`, `m-search`, `notify`, `subscribe`, `unsubscribe`, `patch`, `search` и `connect`.
```
