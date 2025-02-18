---
layout: page
title: Предоставление статических файлов в Express
description: Understand how to serve static files like images, CSS, and JavaScript in Express.js applications using the built-in 'static' middleware.
menu: starter
lang: ru
redirect_from: /starter/static-files.html
---

# Предоставление статических файлов в Express

Для предоставления статических файлов, например, изображений, файлов CSS и JavaScript в Express используется функция промежуточной обработки `express.static`.

The function signature is:

```js
express.static(root, [options])
```

The `root` argument specifies the root directory from which to serve static assets.
For more information on the `options` argument, see [express.static](/{{page.lang}}/4x/api.html#express.static).

Например, воспользуйтесь приведенным ниже кодом для предоставления изображений, файлов CSS и JavaScript, расположенных в каталоге `public`:

```js
app.use(express.static('public'))
```

Теперь можно загрузить файлы, находящиеся в каталоге `public` directory:

```text
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```

<div class="doc-box doc-info">
Express выполняет поиск файлов относительно статического каталога, поэтому имя статического каталога не является частью URL.
</div>

Для использования нескольких каталогов, содержащих статические ресурсы, необходимо вызвать функцию промежуточной обработки `express.static` несколько раз:

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

Express выполняет поиск файлов в том порядке, в котором указаны статические каталоги в функции промежуточной обработки `express.static`.

{% capture alert_content %}
For best results, [use a reverse proxy](/{{page.lang}}/advanced/best-practice-performance.html#use-a-reverse-proxy) cache to improve performance of serving static assets.
{% endcapture %}
{% include admonitions/note.html content=alert_content %}

Для того чтобы создать префикс виртуального пути (то есть, пути, фактически не существующего в файловой системе) для файлов, предоставляемых с помощью функции `express.static`, необходимо [указать путь монтирования](/{{ page.lang }}/4x/api.html#app.use) для статического каталога, как показано ниже:

```js
app.use('/static', express.static('public'))
```

Теперь можно загрузить файлы, находящиеся в каталоге `public`, указанного в префиксе пути `/static`.

```text
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
```

Тем не менее, путь, переданный в функцию `express.static`, указан относительно каталога, из которого запускается процесс `node`. В случае запуска приложения Express из другого каталога, безопаснее использовать абсолютный путь к каталогу для предоставления файлов:

```js
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')))
```

For more details about the `serve-static` function and its options, see  [serve-static](/resources/middleware/serve-static.html).

### [Previous: Basic Routing ](/{{ page.lang }}/starter/basic-routing.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: More examples ](/{{ page.lang }}/starter/examples.html)
