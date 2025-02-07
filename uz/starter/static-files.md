---
layout: page
title: Expressda server statik fayllar
description: Understand how to serve static files like images, CSS, and JavaScript in Express.js applications using the built-in 'static' middleware.
menu: starter
lang: uz
redirect_from: /starter/static-files.html
---

# Expressda server statik fayllar

Serverda statik fayllar bu rasmlar, CSS, JavaScript va fayllarni misol qilish mumkin, ular Expressda o'rnatilgan Expressda o'rnatilgan `express.static` middleware orqali ko'rsatiladi.

The function signature is:

```js
express.static(root, [options])
```

The `root` argument specifies the root directory from which to serve static assets.
For more information on the `options` argument, see [express.static](/{{page.lang}}/4x/api.html#express.static).

For example, use the following code to serve images, CSS files, and JavaScript files in a directory named `public`:

```js
app.use(express.static('public'))
```

Agar siz ko'pgina direktoriyani statik qilmoqchi bo'lsangiz unda, `express.static` oraliq qayta ishlovchisini yana foydalanishingiz mumkin:

```text
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```

<div class="doc-box doc-info">
Express looks up the files relative to the static directory, so the name of the static directory is not part of the URL.
</div>

To use multiple static assets directories, call the `express.static` middleware function multiple times:

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

Endi esa `public` direktoriyansidagi statik fayllarni "/static" prefiksi orqali olinadi.

{% capture alert_content %}
For best results, [use a reverse proxy](/{{page.lang}}/advanced/best-practice-performance.html#use-a-reverse-proxy) cache to improve performance of serving static assets.
{% endcapture %}
{% include admonitions/note.html content=alert_content %}

Agarda siz `express.static` orqali ko'rsatgan direktoriyangiz boshqa joyda ishga tushmasa, Siz uning absolyut manzilini ko'rsatishingiz kerak bo'ladi, masalan u mana bunday bo'ladi:

```js
app.use('/static', express.static('public'))
```

Now, you can load the files that are in the `public` directory from the `/static` path prefix.

```text
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
```

However, the path that you provide to the `express.static` function is relative to the directory from where you launch your `node` process. If you run the express app from another directory, it's safer to use the absolute path of the directory that you want to serve:

```js
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))
```

For more details about the `serve-static` function and its options, see  [serve-static](/resources/middleware/serve-static.html).

### [Previous: Basic Routing ](/{{ page.lang }}/starter/basic-routing.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: More examples ](/{{ page.lang }}/starter/examples.html)
