---
layout: page
title: Миграция до версии Express 5
description: A comprehensive guide to migrating your Express.js applications from version 4 to 5, detailing breaking changes, deprecated methods, and new improvements.
menu: guide
lang: ru
redirect_from: /guide/migrating-5.html
---

# Переход к Express 5

<h2 id="overview">Обзор</h2>

Express 5 не слишком отличается от Express 4: Изменения в API не столь значительны, как в версии 4.0 по сравнению с версией 3.0. Хотя базовый API остается прежним, изменения, ломающие существующий код, все же присутствуют; другими словами, существующая программа версии Express 4, возможно, не будет работать после обновления до версии Express 5.

To install this version, you need to have a Node.js version 18 or higher. Then, execute the following command in your application directory:

```sh
$ npm install "express@^{{ site.data.express.next_version }}" --save
```

Затем можно провести автоматическое тестирование, выявить сбои и устранить неполадки в соответствии с перечисленными ниже изменениями. После устранения сбоев, выявленных путем тестирования, запустите приложение и обратите внимание на возникшие ошибки. Если приложением используются методы или свойства, поддержка которых приостановлена, вы заметите это немедленно.

<h2 id="changes">Изменения в Express 5</h2>

**Удаленные методы и свойства**

<ul class="doclist">
  <li><a href="#app.del">app.del()</a></li>
  <li><a href="#app.param">app.param(fn)</a></li>
  <li><a href="#plural">Названия методов во множественном числе</a></li>
  <li><a href="#leading">Двоеточие перед аргументом name в app.param(name, fn)</a></li>
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

**Усовершенствованные:**

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

**Измененные:**

<ul class="doclist">
  <li><a href="#res.render">res.render()</a></li>
  <li><a href="#brotli-support">Brotli encoding support</a></li>
</ul>

### Удаленные методы и свойства

Если указанные ниже методы и свойства используются в вашем приложении, оно даст сбой. Поэтому, после обновления до версии 5 вам потребуется внести изменения в существующее приложение.

<h4 id="app.del">app.del()</h4>

В Express 5 больше не поддерживается функция `app.del()`. В случае использования этой функции выдается сообщение об ошибке. Для регистрации маршрутов HTTP DELETE воспользуйтесь функцией `app.delete()`.

Первоначально, вместо `delete` использовался код `del`, так как `delete` является зарезервированным ключевым словом в JavaScript. Тем не менее, начиная с версии ECMAScript 6, `delete` и другие зарезервированные ключевые слова разрешается использовать в качестве имен свойств.

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

Сигнатура `app.param(fn)` использовалась для изменения особенностей функции `app.param(name, fn)`. Она помечена как устаревшая, начиная с версии 4.11.0, а в Express 5 ее поддержка окончательно приостановлена.

<h4 id="plural">Названия методов во множественном числе</h4>

Перечисленные ниже названия методов преобразованы в форму множественного числа. В Express 4 при использовании старых методов выдавалось предупреждение об устаревании. В Express 5 они уже не поддерживаются:

`req.acceptsLanguage()` заменен на `req.acceptsLanguages()`.

`req.acceptsCharset()` заменен на `req.acceptsCharsets()`.

`req.acceptsEncoding()` заменен на `req.acceptsEncodings()`.

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

<h4 id="leading">Двоеточие (:) перед аргументом name в app.param(name, fn)</h4>

Символ двоеточия (:) перед аргументом name в функции `app.param(name, fn)` - это пережиток Express 3, и в целях совместимости с предыдущими версиями он поддерживался в Express 4, снабженный пометкой об устаревании. В Express 5 это полностью игнорируется, и параметр name будет использоваться без предшествующего двоеточия.

Это не повлияет на существующий код, при условии следования документации Express 4 в отношении параметра [app.param](/{{ page.lang }}/4x/api.html#app.param), поскольку там нет упоминания о двоеточии перед аргументом.

<h4 id="req.param">req.param(name)</h4>

Этот потенциально неоднозначный и опасный метод извлечения данных форм был удален. Теперь следует специально обращать внимание на имя конкретного переданного параметра в объекте `req.params`, `req.body` и `req.query`.

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

В Express 5 больше не поддерживается сигнатура `res.json(obj, status)`. Вместо этого необходимо задать аргумент status и объединить его в цепочку с методом `res.json()` следующим образом: `res.status(status).json(obj)`.

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

В Express 5 больше не поддерживается сигнатура `res.jsonp(obj, status)`. Вместо этого необходимо задать аргумент status и объединить его в цепочку с методом `res.jsonp()` следующим образом: `res.status(status).jsonp(obj)`.

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

В Express 5 больше не поддерживается сигнатура `res.send(obj, status)`. Вместо этого необходимо задать аргумент status и объединить его в цепочку с методом `res.send()` следующим образом: `res.status(status).send(obj)`.

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

В Express 5 больше не поддерживается сигнатура <code>res.send(<em>status</em>)</code>, где _`status`_ является числом. Вместо этого используйте функцию `res.sendStatus(statusCode)`, которая задает код состояния заголовка ответа HTTP и отправляет текстовую версию кода: "Not Found" ("Не найдено"), "Internal Server Error" ("Внутренняя ошибка сервера") и т.д.
Если необходимо передать число с помощью функции `res.send()`, заключите его в кавычки, чтобы преобразовать в строку. Таким образом, Express не будет интерпретировать передачу числа как попытку использования неподдерживаемой устаревшей сигнатуры.

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

В Express 5 функция `res.sendfile()` заменена вариантом, в котором вторая часть составной фразы написана с заглавной буквы: `res.sendFile()`.

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

<h3>Измененные:</h3>

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

Express 5.0 пока выпущен как альфа-версия, но ниже кратко описаны изменения, которые будут внесены в этом выпуске, а также способы миграции приложения Express 4 до версии Express 5.

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

Объект `app.router`, удаленный в Express 4, возвращен в Express 5. В новой версии данный объект представляет собой лишь ссылку на базовый маршрутизатор Express, в отличие от Express 3, где приложение должно было загружать его явным образом.

<h4 id="req.body">req.body</h4> 

The `req.body` property returns `undefined` when the body has not been parsed. In Express 4, it returns `{}` by default.

<h4 id="req.host">req.host</h4>

В Express 4 функция `req.host` некорректно отсекала номер порта, если таковой был указан. В Express 5 указание номера порта сохраняется.

<h4 id="req.query">req.query</h4>

The `req.query` property is no longer a writable property and is instead a getter. The default query parser has been changed from "extended" to "simple".

<h4 id="res.clearCookie">res.clearCookie</h4>

The `res.clearCookie` method ignores the `maxAge` and `expires` options provided by the user.

<h4 id="res.status">res.status</h4>

The `res.status` method only accepts integers in the range of `100` to `999`, following the behavior defined by Node.js, and it returns an error when the status code is not an integer.

<h4 id="res.query">res.vary</h4>

The `res.vary` throws an error when the `field` argument is missing. In Express 4, if the argument was omitted, it gave a warning in the console

### Усовершенствования

<h4 id="res.render">res.render()</h4>

Этот метод принудительно задает асинхронное представление для всех средств просмотра, что позволяет избежать ошибок, возникавших из-за средств просмотра с синхронной реализацией, не соответствующих рекомендованному интерфейсу.

<h4 id="brotli-support">Brotli encoding support</h4>

Express 5 supports Brotli encoding for requests received from clients that support it.
