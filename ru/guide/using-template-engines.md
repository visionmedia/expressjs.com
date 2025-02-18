---
layout: page
title: Использование шаблонизаторов в Express
description: Discover how to integrate and use template engines like Pug, Handlebars, and EJS with Express.js to render dynamic HTML pages efficiently.
menu: guide
lang: ru
redirect_from: /guide/using-template-engines.html
---

# Использование шаблонизаторов в Express

A _template engine_ enables you to use static template files in your application. At runtime, the template engine replaces
variables in a template file with actual values, and transforms the template into an HTML file sent to the client.
This approach makes it easier to design an HTML page.

The [Express application generator](/{{ page.lang }}/starter/generator.html) uses [Pug](https://pugjs.org/api/getting-started.html) as its default, but it also supports [Handlebars](https://www.npmjs.com/package/handlebars), and [EJS](https://www.npmjs.com/package/ejs), among others.

To render template files, set the following [application setting properties](/{{ page.lang }}/4x/api.html#app.set), in the default `app.js` created by the generator:

- `views`, каталог, в котором находятся файлы шаблонов. Например: `app.set('views', './views')`
  This defaults to the `views` directory in the application root directory.
- `view engine`, используемый шаблонизатор. Например: `app.set('view engine', 'pug')`

Затем установите соответствующий пакет npm шаблонизатора:

```bash
$ npm install pug --save
```

<div class="doc-box doc-notice" markdown="1">
Шаблонизаторы, совместимые с Express, например, Pug, экспортируют функцию `__express(filePath, options, callback)`, вызываемую с помощью функции `res.render()` для вывода кода шаблона.

Это правило действует не для всех шаблонизаторов. Библиотека [Consolidate.js](https://www.npmjs.org/package/consolidate) соблюдает его путем преобразования всех популярных шаблонизаторов Node.js, благодаря чему работает в Express без проблем.

</div>

После указания механизма визуализации (view engine) не нужно указывать его или загружать модуль шаблонизатора в приложение; Express загружает модуль внутренними средствами, как показано далее (для примера, приведенного выше).

```js
app.set('view engine', 'pug')
```

Создайте файл шаблона Pug с именем `index.pug` в каталоге `views` со следующим содержанием:

```pug
html
  head
    title= title
  body
    h1= message
```

Затем создайте маршрут для вывода файла `index.pug`. Если свойство `view engine` не задано, необходимо указать расширение файла `view`. В противном случае, можно не указывать расширение.

```js
app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})
```

При выполнении запроса к домашней странице файл `index.pug` будет отображаться как HTML.

The view engine cache does not cache the contents of the template's output, only the underlying template itself. The view is still re-rendered with every request even when the cache is on.
