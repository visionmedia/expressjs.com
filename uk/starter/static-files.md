---
layout: page
title: Обробка статичних файлів в Express
description: Understand how to serve static files like images, CSS, and JavaScript in Express.js applications using the built-in 'static' middleware.
menu: starter
lang: uk
redirect_from: /starter/static-files.html
---

# Обробка статичних файлів в Express

Для обробки статичних файлів, таких як зображення, CSS файли, та JavaScript файли, використовуйте вбудовану у Express функцію `express.static`.

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

Щоб використовувати декілька директорій для статичних файлів, викличіть функцію `express.static`  декілька разів:

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

Щоб створити віртуальний префікс для шляху (якщо шлях насправді відсутній у файловій системі) для файлів які обробляються функцією `express.static`, [та встановити власний маршрут](/{{ page.lang }}/4x/api.html#app.use) зробіть як показано нище:

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

Тепер ви можете підключити файли, які знаходяться у директорії `public` з використанням префіксу `/static`.

{% capture alert_content %}
For best results, [use a reverse proxy](/{{page.lang}}/advanced/best-practice-performance.html#use-a-reverse-proxy) cache to improve performance of serving static assets.
{% endcapture %}
{% include admonitions/note.html content=alert_content %}

To create a virtual path prefix (where the path does not actually exist in the file system) for files that are served by the `express.static` function, [specify a mount path](/{{ page.lang }}/4x/api.html#app.use) for the static directory, as shown below:

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
