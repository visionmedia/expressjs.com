---
layout: page
title: Contoh Express "Hello World"
description: Get started with Express.js by building a simple 'Hello World' application, demonstrating the basic setup and server creation for beginners.
menu: starter
lang: id
redirect_from: /starter/hello-world.html
---

# Contoh hello world

<div class="doc-box doc-info" markdown="1">
Embedded below is essentially the simplest Express app you can create. It is a single file app &mdash; _not_ what you'd get if you use the [Express generator](/{{ page.lang }}/starter/generator.html), which creates the scaffolding for a full app with numerous JavaScript files, Jade templates, and sub-directories for various purposes.
</div>

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

This app starts a server and listens on port 3000 for connections. The app responds with "Hello World!" for requests
to the root URL (`/`) or _route_. For every other path, it will respond with a **404 Not Found**.

### Berjalan secara Lokal

First create a directory named `myapp`, change to it and run `npm init`. Then, install `express` as a dependency, as per the [installation guide](/{{ page.lang }}/starter/installing.html).

Di direktori `myapp`, buat file bernama `app.js` dan salin kode dari contoh di atas.

<div class="doc-box doc-notice" markdown="1">
`req` (<em>request</em>) dan `res` (<em>response</em>) adalah <em>objects</em> yang sama persis dengan yang disediakan Node, sehingga Anda dapat memanggilnya
`req.pipe()`, `req.on('data', callback)`, dan apa pun yang akan Anda lakukan tanpa melibatkan Express.
</div>

Jalankan aplikasi dengan perintah berikut:

```bash
$ node app.js
```

Kemudian, kunjungi `http://localhost:3000/` di browser untuk melihat hasilnya.

### [Previous: Installing ](/{{ page.lang }}/starter/installing.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: Express Generator ](/{{ page.lang }}/starter/generator.html)
