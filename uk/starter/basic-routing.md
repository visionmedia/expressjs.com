---
layout: page
title: Базова маршрутизація Express
description: Learn the fundamentals of routing in Express.js applications, including how to define routes, handle HTTP methods, and create route handlers for your web server.
menu: starter
lang: uk
redirect_from: /starter/basic-routing.html
---

# Базова маршрутизація

_Routing_ refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

Кожен маршрут може мати одну чи більше функцій-обробників, що виконуються, коли даний маршрут затверджено як співпадаючий.

Визначення маршрутів має наступну структуру:

```js
app.METHOD(PATH, HANDLER)
```

Де:

- `app` є екземпляром `express`.
- `METHOD` є [методом HTTP-запиту](https://uk.wikipedia.org/wiki/HTTP).
- `PATH` є шляхом на сервері.
- `HANDLER` є функцією-обробником, що спрацьовує, коли даний маршрут затверджено як співпадаючий.

<div class="doc-box doc-notice" markdown="1">
This tutorial assumes that an instance of `express` named `app` is created and the server is running. If you are not familiar with creating an app and starting it, see the [Hello world example](/{{ page.lang }}/starter/hello-world.html).
</div>

В наступних прикладах продемонстровано визначення простих маршрутів.

Визначення маршруту, що відповідає на GET-запити до головної сторінки, в результаті чого друкується `Hello World!`:

```js
app.get('/', (req, res) => {
  res.send('Hello World!')
})
```

Визначення маршруту, що відповідає на POST-запити до кореневого маршруту (`/`), тобто до головної сторінки:

```js
app.post('/', (req, res) => {
  res.send('Маємо POST-запит')
})
```

Визначення маршруту, що відповідає на PUT-запити до `/user`:

```js
app.put('/user', (req, res) => {
  res.send('Маємо PUT-запит до /user')
})
```

Визначення маршруту, що відповідає на DELETE-запити до `/user`:

```js
app.delete('/user', (req, res) => {
  res.send('Маємо DELETE-запит до /user')
})
```

Більш детально про маршрутизацію описано на сторінці [гід маршрутизації](/{{ page.lang }}/guide/routing.html).

### [Previous: Express application generator ](/{{ page.lang }}/starter/generator.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: Serving static files in Express ](/{{ page.lang }}/starter/static-files.html)
