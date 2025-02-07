---
layout: page
title: Express 用のテンプレート・エンジンの開発
description: Learn how to develop custom template engines for Express.js using app.engine(), with examples on creating and integrating your own template rendering logic.
menu: advanced
lang: ja
redirect_from: /advanced/developing-template-engines.html
---

# Express 用のテンプレート・エンジンの開発

独自のテンプレート・エンジンを作成するには、`app.engine(ext, callback)` メソッドを使用します。`ext` はファイル拡張子を表し、`callback` はテンプレート・エンジン関数です。この関数は、ファイルのロケーション、options オブジェクト、およびコールバック関数の項目をパラメーターとして受け入れます。 `ext` refers to the file extension, and `callback` is the template engine function, which accepts the following items as parameters: the location of the file, the options object, and the callback function.

次のコードは、`.ntl` ファイルをレンダリングするための極めて単純なテンプレート・エンジンを実装する例です。

```js
const fs = require('fs') // this engine requires the fs module
app.engine('ntl', (filePath, options, callback) => { // define the template engine
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err)
    // this is an extremely simple template engine
    const rendered = content.toString().replace('#title#', `<title>${options.title}</title>`)
      .replace('#message#', `<h1>${options.message}</h1>`)
    return callback(null, rendered)
  })
})
app.set('views', './views') // specify the views directory
app.set('view engine', 'ntl') // register the template engine
```

Your app will now be able to render `.ntl` files. これで、アプリケーションは `.ntl` ファイルをレンダリングできるようになります。以下のコンテンツで `index.ntl` というファイルを `views` ディレクトリーに作成します。

```pug
#title#
#message#
```

次に、アプリケーションで次のルートを作成します。

```js
app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})
```

ホーム・ページに要求すると、`index.ntl` ファイルは HTML としてレンダリングされます。
