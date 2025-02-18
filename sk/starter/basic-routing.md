---
layout: page
title: Express základný routing
description: Learn the fundamentals of routing in Express.js applications, including how to define routes, handle HTTP methods, and create route handlers for your web server.
menu: starter
lang: sk
redirect_from: /starter/basic-routing.html
---

# Základný routing

_Routing_ rozhoduje o tom, ako aplikácia odpovedá na požiadavky (requesty) klientov na jednotlivých koncových bodoch (endpointoch) reprezentovaných pomocou URI (alebo cesty) a špecifickej HTTP request metódy (GET, POST, atď.).

Každý definovaný route môže mať jednu, alebo viacero handler funkcií, ktoré sa vykonajú v prípade, ak je route spárovaný s požiadavkou klienta.

Route definícia má nasledovnú štruktúru:

```js
app.METHOD(PATH, HANDLER)
```

Kde:

- `app` je `express` inštancia.
- `METHOD` je [HTTP request metóda](http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol).
- `PATH` je cesta na serveri.
- `HANDLER` je funkcia, ktorá sa vykoná, ak je route spárovaný.

<div class="doc-box doc-notice" markdown="1">
This tutorial assumes that an instance of `express` named `app` is created and the server is running. If you are not familiar with creating an app and starting it, see the [Hello world example](/{{ page.lang }}/starter/hello-world.html).
</div>

Nasledujúce priklady ilustrujú definovanie jednoduchých route-ov.

Odpoveď s textom `Hello World!` na hlavnej stránke:

```js
app.get('/', (req, res) => {
  res.send('Hello World!')
})
```

Odpoveď na POST request na hlavný route (`/`), hlavnú stránku aplikácie:

```js
app.post('/', (req, res) => {
  res.send('Got a POST request')
})
```

Odpoveď na PUT request na route `/user`:

```js
app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})
```

Odpoveď na DELETE request na route `/user`:

```js
app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})
```

Viac informácií ohľadom routing-u nájdete v [routing príručke](/{{ page.lang }}/guide/routing.html).

### [Previous: Express application generator ](/{{ page.lang }}/starter/generator.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: Serving static files in Express ](/{{ page.lang }}/starter/static-files.html)
