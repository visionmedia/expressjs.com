---
layout: page
title: Menginstal Ekspres
description: Learn how to install Express.js in your Node.js environment, including setting up your project directory and managing dependencies with npm.
menu: starter
lang: id
redirect_from: /starter/installing.html
---

# Menginstal

Kami asumsikan Anda telah menginstal [Node.js](https://nodejs.org/), buatlah direktori untuk menyimpan aplikasi Anda, dan jadikan itu sebagai direktori kerja Anda.

- [Express versi 4.x](/{{ page.lang }}/4x/api.html) memerlukan Node.js versi 0.10 atau yang lebih tinggi.
- [Express versi 5.x](/{{ page.lang }}/5x/api.html) memerlukan Node.js versi 18 atau yang lebih tinggi.

```bash
$ mkdir myapp
$ cd myapp
```

Use the `npm init` command to create a `package.json` file for your application.
For more information on how `package.json` works, see [Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json).

```bash
$ npm init
```

This command prompts you for a number of things, such as the name and version of your application.
For now, you can simply hit RETURN to accept the defaults for most of them, with the following exception:

```
entry point: (index.js)
```

Enter `app.js`, or whatever you want the name of the main file to be. If you want it to be `index.js`, hit RETURN to accept the suggested default file name.

Now, install Express in the `myapp` directory and save it in the dependencies list. For example:

```bash
$ npm install express
```

Untuk menginstal Express secara sementara dan tidak menambahkannya ke daftar dependensi, jalankan perintah berikut:

```bash
$ npm install express --no-save
```

<div class="doc-box doc-info" markdown="1">
By default with version npm 5.0+, `npm install` adds the module to the `dependencies` list in the `package.json` file; with earlier versions of npm, you must specify the `--save` option explicitly. Then, afterwards, running `npm install` in the app directory will automatically install modules in the dependencies list.
</div>

### [Next: Hello World ](/{{ page.lang }}/starter/hello-world.html)
