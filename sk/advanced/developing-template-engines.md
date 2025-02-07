---
layout: page
title: Vývoj template enginov pre Express
description: Learn how to develop custom template engines for Express.js using app.engine(), with examples on creating and integrating your own template rendering logic.
menu: advanced
lang: sk
redirect_from: /advanced/developing-template-engines.html
---

# Vývoj template enginov pre Express

Use the `app.engine(ext, callback)` method to create your own template engine. `ext` refers to the file extension, and `callback` is the template engine function, which accepts the following items as parameters: the location of the file, the options object, and the callback function.

Nasledujúci kód je príkladom implementácie veľmi jednoduchého template enginu pre rendrovanie `.ntl` súborov.

```js
const fs = require('fs') // this engine requires the fs module
app.engine('ntl', (filePath, options, callback) => { // define the template engine
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(new Error(err))
    // this is an extremely simple template engine
    const rendered = content.toString().replace('#title#', `<title>${options.title}</title>`)
      .replace('#message#', `<h1>${options.message}</h1>`)
    return callback(null, rendered)
  })
})
app.set('views', './views') // specify the views directory
app.set('view engine', 'ntl') // register the template engine
```

Your app will now be able to render `.ntl` files. Create a file named `index.ntl` in the `views` directory with the following content.

```pug
#title#
#message#
```

Potom vo vašej aplikácii vytvorte takýto route:

```js
app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})
```

Keď vykonáte request na home page, `index.ntl` bude vyrendrované ako HTML.
