---
layout: page
title: Debuggovanie Express
description: Learn how to enable and use debugging logs in Express.js applications by setting the DEBUG environment variable for enhanced troubleshooting.
menu: guide
lang: sk
redirect_from: /guide/debugging.html
---

# Debuggovanie Express

Ak chcete vidieť všetky interné logy Express-u, nastavte pri spúštaní vašej aplikácie environment premennú `DEBUG` na hodnotu
`express:*`.

```bash
$ DEBUG=express:* node index.js
```

Na Windows-e použite nasledujúci príkaz.

```bash
> set DEBUG=express:* & node index.js
```

Spustením tohto príkazu v prípade defaultnej aplikácie vygenerovanej pomocou [express generátora](/{{ page.lang }}/starter/generator.html) vypíše nasledujúci výstup:

```bash
$ DEBUG=express:* node ./bin/www
  express:router:route new / +0ms
  express:router:layer new / +1ms
  express:router:route get / +1ms
  express:router:layer new / +0ms
  express:router:route new / +1ms
  express:router:layer new / +0ms
  express:router:route get / +0ms
  express:router:layer new / +0ms
  express:application compile etag weak +1ms
  express:application compile query parser extended +0ms
  express:application compile trust proxy false +0ms
  express:application booting in development mode +1ms
  express:router use / query +0ms
  express:router:layer new / +0ms
  express:router use / expressInit +0ms
  express:router:layer new / +0ms
  express:router use / favicon +1ms
  express:router:layer new / +0ms
  express:router use / logger +0ms
  express:router:layer new / +0ms
  express:router use / jsonParser +0ms
  express:router:layer new / +1ms
  express:router use / urlencodedParser +0ms
  express:router:layer new / +0ms
  express:router use / cookieParser +0ms
  express:router:layer new / +0ms
  express:router use / stylus +90ms
  express:router:layer new / +0ms
  express:router use / serveStatic +0ms
  express:router:layer new / +0ms
  express:router use / router +0ms
  express:router:layer new / +1ms
  express:router use /users router +0ms
  express:router:layer new /users +0ms
  express:router use / &lt;anonymous&gt; +0ms
  express:router:layer new / +0ms
  express:router use / &lt;anonymous&gt; +0ms
  express:router:layer new / +0ms
  express:router use / &lt;anonymous&gt; +0ms
  express:router:layer new / +0ms
```

Následne, keď aplikácia odchytí request, uvidíte nasledujúce logy špecifikované v Express kóde:

```bash
  express:router dispatching GET / +4h
  express:router query  : / +2ms
  express:router expressInit  : / +0ms
  express:router favicon  : / +0ms
  express:router logger  : / +1ms
  express:router jsonParser  : / +0ms
  express:router urlencodedParser  : / +1ms
  express:router cookieParser  : / +0ms
  express:router stylus  : / +0ms
  express:router serveStatic  : / +2ms
  express:router router  : / +2ms
  express:router dispatching GET / +1ms
  express:view lookup "index.pug" +338ms
  express:view stat "/projects/example/views/index.pug" +0ms
  express:view render "/projects/example/views/index.pug" +1ms
```

To see the logs only from the router implementation, set the value of `DEBUG` to `express:router`. Likewise, to see logs only from the application implementation, set the value of `DEBUG` to `express:application`, and so on.

## Aplikácie vygenerované príkazom `express`

Aplikácia vygenerovaná príkazom `express` taktiež používa modul `debug` a jej debug namespace je dostupný pod názvom aplikácie.

Pomocou nasledujúceho príkazu, dokážete povoliť debug výpisy pre aplikáciu vygenerovanú pomocou `$ express sample-app` takto:

```bash
$ DEBUG=sample-app:* node ./bin/www
```

Pomocou čiarkou oddeleného zoznamu názvov môžete špecifikovať viac ako jeden debug namespace:

```bash
$ DEBUG=http,mail,express:* node index.js
```

## Advanced options

When running through Node.js, you can set a few environment variables that will change the behavior of the debug logging:

| Name                | Purpose                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `DEBUG`             | Enables/disables specific debugging namespaces.   |
| `DEBUG_COLORS`      | Whether or not to use colors in the debug output. |
| `DEBUG_DEPTH`       | Object inspection depth.                          |
| `DEBUG_FD`          | File descriptor to write debug output to.         |
| `DEBUG_SHOW_HIDDEN` | Shows hidden properties on inspected objects.     |

{% include admonitions/note.html content="The environment variables beginning with `DEBUG_` end up being
converted into an Options object that gets used with `%o`/`%O` formatters.
See the Node.js documentation for
[`util.inspect()`](https://nodejs.org/api/util.html#util_util_inspect_object_options)
for the complete list." %}
