---
layout: page
title: Migrando para o Express 5
description: A comprehensive guide to migrating your Express.js applications from version 4 to 5, detailing breaking changes, deprecated methods, and new improvements.
menu: guide
lang: pt-br
redirect_from: /guide/migrating-5.html
---

# Migrando para o Express 5

<h2 id="overview">Visão Geral</h2>

O Express 5 não é muito diferente do Express 4: As mudanças na
API não são tão significantes quanto as do 3.0 para o 4.0. Apesar de
a API básica permanecer a mesma, ainda existem mudanças disruptivas;
em outras palavras um programa do Express 4 existente pode não
funcionar se você atualizá-lo para usar o Express 5.

To install this version, you need to have a Node.js version 18 or higher. Then, execute the following command in your application directory:

```sh
$ npm install "express@^{{ site.data.express.next_version }}" --save
```

É possível em seguida executar seus testes automatizados para
verificar o que falha, e corrigir os problemas de acordo com as
atualizações abaixo. Após endereçar as falhas nos testes, execute o
seu aplicativo para verificar quais erros ocorrem. Você descobrirá
imediatamente se o aplicativo utiliza quaisquer métodos ou
propriedades que não são suportados.

<h2 id="changes">Mudanças no Express 5</h2>

**Métodos e propriedades removidas**

<ul class="doclist">
  <li><a href="#app.del">app.del()</a></li>
  <li><a href="#app.param">app.param(fn)</a></li>
  <li><a href="#plural">Nomes de métodos pluralizados</a></li>
  <li><a href="#leading">Vírgula no início no argumento nome para o  app.param(name, fn)</a></li>
  <li><a href="#req.param">req.param(name)</a></li>
  <li><a href="#res.json">res.json(obj, status)</a></li>
  <li><a href="#res.jsonp">res.jsonp(obj, status)</a></li>
  <li><a href="#magic-redirect">res.redirect('back') and res.location('back')</a></li>  
  <li><a href="#res.redirect">res.redirect(url, status)</a></li>
  <li><a href="#res.send.body">res.send(body, status)</a></li>
  <li><a href="#res.send.status">res.send(status)</a></li>
  <li><a href="#res.sendfile">res.sendfile()</a></li>
</ul>

**Melhorias**

<ul class="doclist">
  <li><a href="#path-syntax">Path route matching syntax</a></li>
  <li><a href="#rejected-promises">Rejected promises handled from middleware and handlers</a></li>
  <li><a href="#express.urlencoded">express.urlencoded</a></li>
  <li><a href="#app.listen">app.listen</a></li>
  <li><a href="#app.router">app.router</a></li>
  <li><a href="#req.body">req.body</a></li>
  <li><a href="#req.host">req.host</a></li>
  <li><a href="#req.query">req.query</a></li>
  <li><a href="#res.clearCookie">res.clearCookie</a></li>
  <li><a href="#res.status">res.status</a></li>
  <li><a href="#res.vary">res.vary</a></li>
</ul>

**Mudadas**

<ul class="doclist">
  <li><a href="#res.render">res.render()</a></li>
  <li><a href="#brotli-support">Brotli encoding support</a></li>
</ul>

### Métodos e propriedades removidas

Se estiver usando qualquer um desses métodos ou propriedades
no seu aplicativo, ele irá quebrar. Portanto, será necessário alterar
o seu aplicativo após fazer a atualização para a versão 5.

<h4 id="app.del">app.del()</h4>

O Express 5 não suporta mais a função `app.del()`. Se
você usas esta função um erro será lançado. Para registrar rotas HTTP DELETE, use a função `app.delete()` ao invés disso.

Inicialmente `del` era usada ao invés de
`delete`, porque `delete` é uma
palavra-chave reservada no JavaScript. Entretanto, a partir do ECMAScript 6,
`delete` e outras palavras-chave reservadas podem
legalmente ser usadas como nomes de propriedades.

```js
// v4
app.del('/user/:id', (req, res) => {
  res.send(`DELETE /user/${req.params.id}`)
})

// v5
app.delete('/user/:id', (req, res) => {
  res.send(`DELETE /user/${req.params.id}`)
})
```

<h4 id="app.param">app.param(fn)</h4>

A assinatura `app.param(fn)` foi usada para
modificar o comportamento da função `app.param(name, fn)`. Ela
foi descontinuada desde a v4.11.0, e o Express 5 não a suporta mais de nenhuma forma.

<h4 id="plural">Nomes de métodos pluralizados</h4>

Os seguintes nomes de métodos podem ser pluralizados. No
Express 4, o uso dos métodos antigos resultava em um aviso de
descontinuação.  O Express 5 não os suporta mais de forma nenhuma: Express 5 no longer supports them at all:

`req.acceptsLanguage()` é substituído por `req.acceptsLanguages()`.

`req.acceptsCharset()` é substituído por `req.acceptsCharsets()`.

`req.acceptsEncoding()` é substituído por `req.acceptsEncodings()`.

```js
// v4
app.all('/', (req, res) => {
  req.acceptsCharset('utf-8')
  req.acceptsEncoding('br')
  req.acceptsLanguage('en')

  // ...
})

// v5
app.all('/', (req, res) => {
  req.acceptsCharsets('utf-8')
  req.acceptsEncodings('br')
  req.acceptsLanguages('en')

  // ...
})
```

<h4 id="leading">Dois pontos no começo (:) do nome do app.param(name, fn)</h4>

Um caractere de dois pontos (:) no início do nome para a função
`app.param(name, fn)` é um remanescente do Express
3, e para fins de compatibilidade com versões anteriores, o Express 4
suportava-o com um aviso de descontinuação. O Express 5 irá
silenciosamente ignorá-lo e usar o nome do parâmetro sem prefixá-lo
com os dois pontos.

Isso não deve afetar o seu código se você seguiu a documentação
do Express 4 do [app.param](/{{ page.lang }}/4x/api.html#app.param), já que ela não
menciona os dois pontos no início.

<h4 id="req.param">req.param(name)</h4>

Este é um método potencialmente confuso e perigoso de recuperação de dados de formulário foi removido. Você precisará agora especificamente olhar para o nome do parâmetro enviado no objeto `req.params`,
`req.body`, ou `req.query`.

```js
// v4
app.post('/user', (req, res) => {
  const id = req.param('id')
  const body = req.param('body')
  const query = req.param('query')

  // ...
})

// v5
app.post('/user', (req, res) => {
  const id = req.params.id
  const body = req.body
  const query = req.query

  // ...
})
```

<h4 id="res.json">res.json(obj, status)</h4>

O Express 5 não suporta mais a assinatura `res.json(obj, status)`. Ao
invés disso, configure o status e então encadeie-o ao método `res.json()` assim:
`res.status(status).json(obj)`.

```js
// v4
app.post('/user', (req, res) => {
  res.json({ name: 'Ruben' }, 201)
})

// v5
app.post('/user', (req, res) => {
  res.status(201).json({ name: 'Ruben' })
})
```

<h4 id="res.jsonp">res.jsonp(obj, status)</h4>

O Express 5 não suporta mais a assinatura `res.jsonp(obj, status)`. Ao invés disso, configure o status e então encadeie-o ao método
`res.jsonp()` assim: `res.status(status).jsonp(obj)`.

```js
// v4
app.post('/user', (req, res) => {
  res.jsonp({ name: 'Ruben' }, 201)
})

// v5
app.post('/user', (req, res) => {
  res.status(201).jsonp({ name: 'Ruben' })
})
```

<h4 id="res.redirect">res.redirect(url, status)</h4>

O Express 5 não suporta mais a assinatura `res.send(obj, status)`. Ao invés disso, configure o status e então encadeie-o ao método
`res.send()` assim: `res.status(status).send(obj)`.

```js
// v4
app.get('/user', (req, res) => {
  res.redirect('/users', 301)
})

// v5
app.get('/user', (req, res) => {
  res.redirect(301, '/users')
})
```

<h4 id="magic-redirect">res.redirect('back') and res.location('back')</h4>

Express 5 no longer supports the magic string `back` in the `res.redirect()` and `res.location()` methods. Instead, use the `req.get('Referrer') || '/'` value to redirect back to the previous page. In Express 4, the res.`redirect('back')` and `res.location('back')` methods were deprecated.

```js
// v4
app.get('/user', (req, res) => {
  res.redirect('back')
})

// v5
app.get('/user', (req, res) => {
  res.redirect(req.get('Referrer') || '/')
})
```

<h4 id="res.send.body">res.send(body, status)</h4>

Express 5 no longer supports the signature `res.send(obj, status)`. Instead, set the status and then chain it to the `res.send()` method like this: `res.status(status).send(obj)`.

```js
// v4
app.get('/user', (req, res) => {
  res.send({ name: 'Ruben' }, 200)
})

// v5
app.get('/user', (req, res) => {
  res.status(200).send({ name: 'Ruben' })
})
```

<h4 id="res.send.status">res.send(status)</h4>

O Express 5 não suporta mais a assinatura <code>res.send(<em>status</em>)</code>, onde _`status`_
é um número. Ao invés disso, use a função
`res.sendStatus(statusCode)`, que configura o código
do status do cabeçalho de resposta HTTP  e envia a versão de texto do
código: "Não Encontrado", "Erro Interno de Servidor", e assim por
diante.
Se precisar enviar um número usando a função
`res.send()`, coloque o número entre aspas para
converte-lo para um sequência de caracteres, para que o Express não o
interprete como uma tentativa de usar a assinatura antiga não
suportada.

```js
// v4
app.get('/user', (req, res) => {
  res.send(200)
})

// v5
app.get('/user', (req, res) => {
  res.sendStatus(200)
})
```

<h4 id="res.sendfile">res.sendfile()</h4>

A função `res.sendfile()` foi substituída pela
versão em formato camel-case `res.sendFile()` no
Express 5.

```js
// v4
app.get('/user', (req, res) => {
  res.sendfile('/path/to/file')
})

// v5
app.get('/user', (req, res) => {
  res.sendFile('/path/to/file')
})
```

<h3>Mudadas</h3>

<h4 id="path-syntax">Path route matching syntax</h4>

Path route matching syntax is when a string is supplied as the first parameter to the `app.all()`, `app.use()`, `app.METHOD()`, `router.all()`, `router.METHOD()`, and `router.use()` APIs. The following changes have been made to how the path string is matched to an incoming request:

- The wildcard `*` must have a name, matching the behavior of parameters `:`, use `/*splat` instead of `/*`

```js
// v4
app.get('/*', async (req, res) => {
  res.send('ok')
})

// v5
app.get('/*splat', async (req, res) => {
  res.send('ok')
})
```

{% capture note_wildcard %}
`*splat` matches any path without the root path. If you need to match the root path as well `/`, you can use `/{*splat}`, wrapping the wildcard in braces.

```js
// v5
app.get('/{*splat}', async (req, res) => {
  res.send('ok')
})
```

{% endcapture %}
{% include admonitions/note.html content=note_wildcard %}

- The optional character `?` is no longer supported, use braces instead.

```js
// v4
app.get('/:file.:ext?', async (req, res) => {
  res.send('ok')
})

// v5
app.get('/:file{.:ext}', async (req, res) => {
  res.send('ok')
})
```

- Regexp characters are not supported. For example:

```js
app.get('/[discussion|page]/:slug', async (req, res) => {
  res.status(200).send('ok')
})
```

should be changed to:

```js
app.get(['/discussion/:slug', '/page/:slug'], async (req, res) => {
  res.status(200).send('ok')
})
```

- Some characters have been reserved to avoid confusion during upgrade (`()[]?+!`), use `\` to escape them.
- Parameter names now support valid JavaScript identifiers, or quoted like `:"this"`.

<h4 id="rejected-promises">Rejected promises handled from middleware and handlers</h4>

Request middleware and handlers that return rejected promises are now handled by forwarding the rejected value as an `Error` to the error handling middleware. This means that using `async` functions as middleware and handlers are easier than ever. When an error is thrown in an `async` function or a rejected promise is `await`ed inside an async function, those errors will be passed to the error handler as if calling `next(err)`.

Details of how Express handles errors is covered in the [error handling documentation](/en/guide/error-handling.html).

<h4 id="express.urlencoded">express.urlencoded</h4>

The `express.urlencoded` method makes the `extended` option `false` by default.

<h4 id="app.listen">app.listen</h4>

In Express 5, the `app.listen` method will invoke the user-provided callback function (if provided) when the server receives an error event. In Express 4, such errors would be thrown. This change shifts error-handling responsibility to the callback function in Express 5. If there is an error, it will be passed to the callback as an argument.
For example:

```js
const server = app.listen(8080, '0.0.0.0', (error) => {
  if (error) {
    throw error // e.g. EADDRINUSE
  }
  console.log(`Listening on ${JSON.stringify(server.address())}`)
})
```

<h4 id="app.router">app.router</h4>

O objeto `app.router`, que foi removido no
Express 4, está de volta no Express 5. Na nove versão, este objeto é
apenas uma referência para o roteador Express base, diferentemente do
Express 3, onde um aplicativo tinha que carregá-lo explicitamente.

<h4 id="req.body">req.body</h4> 

The `req.body` property returns `undefined` when the body has not been parsed. In Express 4, it returns `{}` by default.

<h4 id="req.host">req.host</h4>

No Express 4, a função `req.host`
incorretamente removia o número da porta caso estivesse presente. No
Express 5 o número da porta é mantido.

<h4 id="req.query">req.query</h4>

The `req.query` property is no longer a writable property and is instead a getter. The default query parser has been changed from "extended" to "simple".

<h4 id="res.clearCookie">res.clearCookie</h4>

The `res.clearCookie` method ignores the `maxAge` and `expires` options provided by the user.

<h4 id="res.status">res.status</h4>

The `res.status` method only accepts integers in the range of `100` to `999`, following the behavior defined by Node.js, and it returns an error when the status code is not an integer.

<h4 id="res.query">res.vary</h4>

The `res.vary` throws an error when the `field` argument is missing. In Express 4, if the argument was omitted, it gave a warning in the console

### Melhorias

<h4 id="res.render">res.render()</h4>

Este método agora impinge comportamento assíncrono  para todos
os mecanismos de visualização, evitando erros causados pelos
mecanismos de visualização que tinham uma implementação síncrona e
que violavam a interface recomendada.

<h4 id="brotli-support">Brotli encoding support</h4>

Express 5 supports Brotli encoding for requests received from clients that support it.
