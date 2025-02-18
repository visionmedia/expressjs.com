---
layout: page
title: Express FAQ
description: Find answers to frequently asked questions about Express.js, including topics on application structure, models, authentication, template engines, error handling, and more.
menu: starter
lang: id
redirect_from: /starter/faq.html
---

# FAQ

## Bagaimana sebaiknya struktur aplikasi saya?

There is no definitive answer to this question. The answer depends
on the scale of your application and the team that is involved. To be as
flexible as possible, Express makes no assumptions in terms of structure.

Routes and other application-specific logic can live in as many files
as you wish, in any directory structure you prefer. View the following
examples for inspiration:

- [Route listings](https://github.com/expressjs/express/blob/4.13.1/examples/route-separation/index.js#L32-L47)
- [Route map](https://github.com/expressjs/express/blob/4.13.1/examples/route-map/index.js#L52-L66)
- [MVC style controllers](https://github.com/expressjs/express/tree/master/examples/mvc)

Selain itu, ada ekstensi (_extension_) dari pihak ketiga untuk Express, yang menyederhanakan beberapa pola berikut:

- [Resourceful routing](https://github.com/expressjs/express-resource)

## Bagaimana cara mendefinisikan model?

Express has no notion of a database. This concept is
left up to third-party Node modules, allowing you to
interface with nearly any database.

Lihat [LoopBack](http://loopback.io) untuk kerangka kerja berbasis
Express yang berpusat pada model.

## Bagaimana cara mengautentikasi pengguna?

Authentication is another opinionated area that Express does not
venture into. You may use any authentication scheme you wish.
For a simple username / password scheme, see [this example](https://github.com/expressjs/express/tree/master/examples/auth).

## _Template engines_ mana saja yang mendukung Express?

Express supports any template engine that conforms with the `(path, locals, callback)` signature.
To normalize template engine interfaces and caching, see the
[consolidate.js](https://github.com/visionmedia/consolidate.js)
project for support. Unlisted template engines might still support the Express signature.

Untuk informasi lebih lanjut, lihat [Penggunaan _template engine_ dengan Express](/{{page.lang}}/guide/using-template-engines.html).

## Bagaimana cara menangani respon 404?

In Express, 404 responses are not the result of an error, so
the error-handler middleware will not capture them. This behavior is
because a 404 response simply indicates the absence of additional work to do;
in other words, Express has executed all middleware functions and routes,
and found that none of them responded. All you need to
do is add a middleware function at the very bottom of the stack (below all other functions)
to handle a 404 response:

```js
app.use((req, res, next) => {
  res.status(404).send('Maaf data tidak dapat ditemukan!')
})
```

Tambahkan rute secara dinamis saat runtime pada _class_ (_instance_) `express.Router()` sehingga rute tidak digantikan oleh fungsi middleware.

## Bagaimana cara membuat _error handler_?

Anda dapat mendefinisikan _error-handler middleware_ dengan cara yang sama seperti _middleware_ lainnya, kecuali dengan empat argumen, bukan tiga; secara khusus dengan _signature_ `(err, req, res, next)`:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Ada yang salah!')
})
```

Untuk informasi selengkapnya, lihat [Penanganan _Error_](/{{ page.lang }}/guide/error-handling.html).

## Bagaimana cara merender HTML biasa?

You don't! There's no need to "render" HTML with the `res.render()` function.
If you have a specific file, use the `res.sendFile()` function.
If you are serving many assets from a directory, use the `express.static()`
middleware function.

## Versi Node.js apa yang dibutuhkan Express?

- [Express versi 4.x](/{{ page.lang }}/4x/api.html) memerlukan Node.js versi 0.10 atau yang lebih tinggi.
- [Express versi 5.x](/{{ page.lang }}/5x/api.html) memerlukan Node.js versi 18 atau yang lebih tinggi.

### [Previous: More examples ](/{{ page.lang }}/starter/examples.html)
