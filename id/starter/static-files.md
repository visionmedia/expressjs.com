---
layout: page
title: Menampilkan file statis di Express
description: Understand how to serve static files like images, CSS, and JavaScript in Express.js applications using the built-in 'static' middleware.
menu: starter
lang: id
redirect_from: /starter/static-files.html
---

# Menampilkan file statis di Express

Untuk menamplikan file statis seperti gambar, file CSS, dan file JavaScript, dapat menggunakan fungsi middleware bawaan `express.static` di Express.

_Signature_ fungsinya adalah:

```js
express.static(root, [options])
```

The `root` argument specifies the root directory from which to serve static assets.
For more information on the `options` argument, see [express.static](/{{page.lang}}/4x/api.html#express.static).

Misalnya, gunakan kode berikut untuk menyajikan gambar, file CSS, dan file JavaScript dalam direktori bernama `public`:

```js
app.use(express.static('public'))
```

Sekarang, Anda dapat melihat file yang ada di direktori `public`:

```text
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```

<div class="doc-box doc-info">
Express mencari file yang berdasarkan lokasi dari direktori statisnya, sehingga nama direktori statis bukan bagian dari URL.
</div>

Untuk menggunakan beberapa direktori aset statis, panggil fungsi middleware `express.static` beberapa kali:

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

Express akan mencari file sesuai urutan Anda mengatur direktori statis melalui fungsi middleware `express.static`.

{% capture alert_content %}
For best results, [use a reverse proxy](/{{page.lang}}/advanced/best-practice-performance.html#use-a-reverse-proxy) cache to improve performance of serving static assets.
{% endcapture %}
{% include admonitions/note.html content=alert_content %}

Untuk membuat awalan jalur virtual (yang jalurnya sebenarnya tidak ada dalam sistem file) untuk file yang akan ditampilkan oleh fungsi `express.static`, [tentukan jalur pemasangan](/{{ page.lang }}/4x /api.html#app.use) untuk direktori statis, seperti yang ditunjukkan di bawah ini:

```js
app.use('/static', express.static('public'))
```

Sekarang, Anda dapat melihat file yang ada di direktori `public` menggunakan awalan jalur `/static`.

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

Untuk detail selengkapnya tentang fungsi `serve-static` dan opsinya, lihat [serve-static](/resources/middleware/serve-static.html).

### [Previous: Basic Routing ](/{{ page.lang }}/starter/basic-routing.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: More examples ](/{{ page.lang }}/starter/examples.html)
