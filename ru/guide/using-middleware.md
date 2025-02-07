---
layout: page
title: Использование промежуточных обработчиков Express
description: Learn how to use middleware in Express.js applications, including application-level and router-level middleware, error handling, and integrating third-party middleware.
menu: guide
lang: ru
redirect_from: /guide/using-middleware.html
---

# Использование промежуточных обработчиков

Express - это веб-фреймворк маршрутизации и промежуточной обработки с минимальной собственной функциональностью: приложение Express, по сути, представляет собой серию вызовов функций промежуточной обработки.

Функции _промежуточной обработки_ (middleware) - это функции, имеющие доступ к [объекту запроса](/{{ page.lang }}/4x/api.html#req)  (`req`), [объекту ответа](/{{ page.lang }}/4x/api.html#res) (`res`) и к следующей функции промежуточной обработки в цикле "запрос-ответ" приложения. Следующая функция промежуточной обработки, как правило, обозначается переменной `next`.

Функции промежуточной обработки могут выполнять следующие задачи:

- Выполнение любого кода.
- Внесение изменений в объекты запросов и ответов.
- Завершение цикла "запрос-ответ".
- Вызов следующей функции промежуточной обработки из стека.

Если текущая функция промежуточной обработки не завершает цикл "запрос-ответ", она должна вызвать `next()` для передачи управления следующей функции промежуточной обработки. В противном случае запрос зависнет.

Приложение Express может использовать следующие типы промежуточных обработчиков:

- [Промежуточный обработчик уровня приложения](#middleware.application)
- [Промежуточный обработчик уровня маршрутизатора](#middleware.router)
- [Промежуточный обработчик для обработки ошибок](#middleware.error-handling)
- [Встроенные промежуточные обработчики](#middleware.built-in)
- [Промежуточные обработчики сторонних поставщиков ПО](#middleware.third-party)

Промежуточные обработчики уровня приложения и уровня маршрутизатора можно загружать с помощью необязательного пути для монтирования.
Также можно загрузить последовательность функций промежуточной обработки одновременно, в результате чего создается вспомогательный стек системы промежуточных обработчиков в точке монтирования.

<h2 id='middleware.application'>Промежуточный обработчик уровня приложения</h2>

Свяжите промежуточный обработчик уровня приложения с экземпляром [объекта приложения](/{{ page.lang }}/4x/api.html#app), воспользовавшись функциями `app.use()` и `app.METHOD()`, где `METHOD` - метод HTTP запроса, обрабатываемый функцией промежуточной обработки (например, GET, PUT или POST) в нижнем регистре.

В данном примере представлена функция промежуточной обработки без пути монтирования. Эта функция выполняется при каждом получении запроса приложением.

```js
const app = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```

В данном примере представлена функция промежуточной обработки, монтируемая в путь `/user/:id`. Эта функция выполняется для всех типов запросов
HTTP в пути `/user/:id`.

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

В данном примере представлен маршрут и функция его обработки (система промежуточных обработчиков). Эта функция обрабатывает запросы GET, адресованные ресурсам в пути `/user/:id`.

```js
app.get('/user/:id', (req, res, next) => {
  res.send('USER')
})
```

Ниже приводится пример загрузки последовательности функций промежуточной обработки в точку монтирования, с указанием пути монтирования.
Этот пример иллюстрирует создание вспомогательного стека промежуточных обработчиков, с выводом информации о запросе для всех типов запросов HTTP, адресованных ресурсам в пути `/user/:id`.

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

Обработчики маршрутов позволяют определить несколько маршрутов для одного пути. В приведенном ниже примере определено два маршрута для запросов GET, адресованных ресурсам в пути `/user/:id`. Второй маршрут не создает никаких неудобств, но его вызов никогда не будет выполнен, поскольку первый маршрут завершает цикл "запрос-ответ".

В данном примере представлен вспомогательный стек промежуточных обработчиков для обработки запросов GET, адресованных ресурсам в пути `/user/:id`.

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

Для того чтобы пропустить остальные функции дополнительной обработки в стеке промежуточных обработчиков маршрутизатора, вызовите `next('route')` для передачи управления следующему маршруту.

**ПРИМЕЧАНИЕ**: `next('route')` работает только в функциях промежуточной обработки, загруженных с помощью функций `app.METHOD()` или `router.METHOD()`. %}

Перенаправление к заключительному символу "/", если имя пути - это каталог.

```js
app.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next() //
}, (req, res, next) => {
  // render a regular page
  res.render('regular')
})

// handler for the /user/:id path, which renders a special page
app.get('/user/:id', (req, res, next) => {
  res.render('special')
})
```

Middleware can also be declared in an array for reusability.

Ниже приводится пример использования функции промежуточной обработки `express.static` с объектом дополнительных опций:

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

<h2 id='middleware.router'>Промежуточный обработчик уровня маршрутизатора</h2>

Промежуточный обработчик уровня маршрутизатора работает так же, как и промежуточный обработчик уровня приложения, но он привязан к экземпляру `express.Router()`.

```js
const router = express.Router()
```

Загрузите промежуточный обработчик уровня маршрутизатора с помощью функций `router.use()` и `router.METHOD()`.

В приведенном ниже примере с помощью промежуточного обработчика уровня маршрутизатора создается копия системы промежуточных обработчиков, представленной выше для обработчиков уровня приложения:

```js
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
  else next() //
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

To skip the rest of the router's middleware functions, call `next('router')`
to pass control back out of the router instance.

В данном примере представлен вспомогательный стек промежуточных обработчиков для обработки запросов GET, адресованных ресурсам в пути `/user/:id`.

```js
const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(express.static('public', options))
```

<h2 id='middleware.error-handling'>Промежуточный обработчик для обработки ошибок</h2>

<div class="doc-box doc-notice" markdown="1">
Промежуточный обработчик ошибок всегда содержит *четыре* аргумента. Для определения данной функции как обработчика ошибок необходимо указать четыре аргумента. Даже если вам не нужно использовать объект `next`, необходимо указать его, чтобы сохранить сигнатуру. В противном случае, объект `next` будет интерпретирован как обычный промежуточный обработчик, который не будет обрабатывать ошибки.
</div>

Определите функции промежуточного обработчика для обработки ошибок так же, как другие функции промежуточной обработки, но с указанием не трех, а четырех аргументов в сигнатуре `(err, req, res, next)`):

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

Подробная информация о промежуточном обработчике ошибок приведена в разделе [Обработка ошибок](/{{ page.lang }}/guide/error-handling.html).

<h2 id='middleware.built-in'>Встроенные промежуточные обработчики</h2>

Начиная с версии 4.x, Express не является зависимым от [Connect](https://github.com/senchalabs/connect). За исключением `express.static`, все функции промежуточной обработки, ранее включенные в Express, находятся в отдельных модулях. Ознакомьтесь со [списком функций промежуточной обработки](https://github.com/senchalabs/connect#middleware).

Express has the following built-in middleware functions:

- [express.static](/en/4x/api.html#express.static) serves static assets such as HTML files, images, and so on.
- [express.json](/en/4x/api.html#express.json) parses incoming requests with JSON payloads. **NOTE: Available with Express 4.16.0+**
- [express.urlencoded](/en/4x/api.html#express.urlencoded) parses incoming requests with URL-encoded payloads.  **NOTE: Available with Express 4.16.0+**

<h2 id='middleware.third-party'>Third-party middleware</h2>

Для расширения функциональности приложений Express используются промежуточные обработчики сторонних поставщиков ПО.

Установите модуль Node.js для соответствующей функциональной возможности, затем загрузите его в приложение на уровне приложения или на уровне маршрутизатора.

В приведенном ниже примере показана установка и загрузка функции промежуточной обработки для синтаксического анализа cookie `cookie-parser`.

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

Список функций промежуточных обработчиков, предоставляемых сторонними поставщиками ПО и часто используемых в Express, приведен в разделе  [Промежуточные обработчики сторонних поставщиков ПО](../resources/middleware.html).
