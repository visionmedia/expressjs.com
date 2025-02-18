---
layout: page
title: Лучшие практические методы защиты для Express в рабочей среде
description: Discover crucial security best practices for Express apps in production, including using TLS, input validation, secure cookies, and preventing vulnerabilities.
menu: advanced
lang: ru
redirect_from: /advanced/best-practice-security.html
---

# Лучшие практические методы для рабочей среды: Защита

## Обзор

Термин _"рабочий режим"_ означает тот этап жизненного цикла программного обеспечения, на котором приложение или API является в целом доступным для конечных пользователей или потребителей. Напротив, на этапе _"разработки"_ происходит активное создание и тестирование кода, и приложение не является открытым для внешнего доступа. Соответствующие системные среды называются, соответственно, _рабочей_ средой и средой _разработки_.

Настройки среды разработки и рабочей среды при установке, как правило, являются различными, и к этим средам предъявляются абсолютно разные требования. То, что идеально для разработки, не всегда приемлемо в рабочем режиме. Например, в среде разработки можно задать подробное протоколирование ошибок для отладки, тогда как в рабочей среде такая особенность настройки может привести к уязвимости защиты. Во время разработки можно не беспокоиться о масштабируемости, надежности и производительности, тогда как в рабочем режиме все эти вопросы играют решающую роль.

{% include admonitions/note.html content="If you believe you have discovered a security vulnerability in Express, please see
[Security Policies and Procedures](/en/resources/contributing.html#security-policies-and-procedures).
" %}

Security best practices for Express applications in production include:

- [hidePoweredBy](https://github.com/helmetjs/hide-powered-by) удаляет заголовок `X-Powered-By`.
- [hsts](https://github.com/helmetjs/hsts) задает заголовок `Strict-Transport-Security`, принудительно активирующий защиту соединений с сервером (по протоколу HTTP с использованием SSL/TLS).
- [Do not trust user input](#do-not-trust-user-input)
  - [Prevent open redirects](#prevent-open-redirects)
- Если вы используете `helmet.js`, это будет сделано автоматически.
- [Reduce fingerprinting](#reduce-fingerprinting)
- [frameguard](https://github.com/helmetjs/frameguard) задает заголовок `X-Frame-Options` для защиты от  [кликджекинга](https://www.owasp.org/index.php/Clickjacking).
  - [noCache](https://github.com/helmetjs/nocache) задает заголовок `Cache-Control` и заголовки Pragma для отключения кеширования на стороне клиента.
  - [ieNoOpen](https://github.com/helmetjs/ienoopen) задает заголовок `X-Download-Options` для IE8+.
- [Prevent brute-force attacks against authorization](#prevent-brute-force-attacks-against-authorization)
- [Ensure your dependencies are secure](#ensure-your-dependencies-are-secure)
  - [csp](https://github.com/helmetjs/csp) задает заголовок `Content-Security-Policy` для предотвращения атак межсайтового скриптинга и прочих межсайтовых вмешательств.
- [Additional considerations](#additional-considerations)

## Не используйте устаревшие или уязвимые версии Express

Версии Express 2.x и 3.x больше не поддерживаются. Проблемы, связанные с защитой и производительностью в этих версиях, не будут подлежать решению. Не используйте эти версии! Если вы еще не перешли к работе с версией 4, выполните инструкции, приведенные в [руководстве по миграции](/{{ page.lang }}/guide/migrating-4.html).

Кроме того, убедитесь в том, что уязвимые версии Express, перечисленные на странице [Обновления системы защиты](/{{ page.lang }}/advanced/security-updates.html), вами не используются. В противном случае, выполните обновление до одного из стабильных выпусков, предпочтительно, до последнего.

## Использование TLS

Если ваше приложение предназначено для работы с чувствительными данными или для их передачи, для защиты соединения и данных необходимо использовать криптографический протокол [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS). Данная технология позволяет шифровать данные до передачи с клиента на сервер, тем самым обеспечивая защиту от многих  распространенных (и простых) способов несанкционированного доступа. Хотя запросы Ajax и POST могут казаться неочевидными и "скрытыми" в браузерах, инициируемая ими передача данных в сети является уязвимой для [незаконного сбора и анализа пакетов](https://en.wikipedia.org/wiki/Packet_analyzer) и[атак посредника (атак "человек посередине")](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

Возможно, вам знаком криптографический протокол Secure Socket Layer (SSL). [SSL является предшественником TLS](https://msdn.microsoft.com/en-us/library/windows/desktop/aa380515\(v=vs.85\).aspx). Другими словами, если раньше вы пользовались SSL, пора переходить к TLS. В целом, для работы с TLS мы рекомендуем использовать сервер Nginx. Подробные инструкции по настройке TLS на Nginx (и на других серверах) можно найти в разделе    [Рекомендуемые конфигурации серверов (Mozilla Wiki)](https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_Server_Configurations).

Кроме того, удобным инструментом для получения бесплатного сертификата TLS является [Let's Encrypt](https://letsencrypt.org/about/) - бесплатная, автоматическая и открытая сертификатная  компания (CA), предоставленная корпорацией [Internet Security Research Group (ISRG)](https://letsencrypt.org/isrg/).

## Do not trust user input

For web applications, one of the most critical security requirements is proper user input validation and handling. This comes in many forms and we will not cover all of them here.
Ultimately, the responsibility for validating and correctly handling the types of user input your application accepts is yours.

### Prevent open redirects

An example of potentially dangerous user input is an _open redirect_, where an application accepts a URL as user input (often in the URL query, for example `?url=https://example.com`) and uses `res.redirect` to set the `location` header and
return a 3xx status.

An application must validate that it supports redirecting to the incoming URL to avoid sending users to malicious links such as phishing websites, among other risks.

Here is an example of checking URLs before using `res.redirect` or `res.location`:

```js
app.use((req, res) => {
  try {
    if (new Url(req.query.url).host !== 'example.com') {
      return res.status(400).end(`Unsupported redirect to host: ${req.query.url}`)
    }
  } catch (e) {
    return res.status(400).end(`Invalid url: ${req.query.url}`)
  }
  res.redirect(req.query.url)
})
```

## Использование Helmet

[Helmet](https://www.npmjs.com/package/helmet) помогает защитить приложение от некоторых широко известных веб-уязвимостей путем соответствующей настройки заголовков HTTP.

Helmet, по сути, представляет собой набор из девяти более мелких функций промежуточной обработки, обеспечивающих настройку заголовков HTTP, связанную с защитой: Some examples include:

- `helmet.contentSecurityPolicy` which sets the `Content-Security-Policy` header. This helps prevent cross-site scripting attacks among many other things.
- `helmet.hsts` which sets the `Strict-Transport-Security` header. This helps enforce secure (HTTPS) connections to the server.
- `helmet.frameguard` which sets the `X-Frame-Options` header. This provides [clickjacking](https://www.owasp.org/index.php/Clickjacking) protection.

Helmet includes several other middleware functions which you can read about [at its documentation website][helmet].

Установите Helmet, как обычный модуль:

```bash
$ npm install --save helmet
```

Затем используйте его в своем коде:

```js
/// ...

const helmet = require('helmet')
app.use(helmet())

/// ...
```

## Reduce fingerprinting

It can help to provide an extra layer of security to reduce the ability of attackers to determine
the software that a server uses, known as "fingerprinting." Though not a security issue itself,
reducing the ability to fingerprint an application improves its overall security posture.
Server software can be fingerprinted by quirks in how it responds to specific requests, for example in
the HTTP response headers.

By default, Express sends the `X-Powered-By` response header that you can
disable using the `app.disable()` method:

```js
app.disable('x-powered-by')
```

Если использовать Helmet не нужно, как минимум, отключите заголовок `X-Powered-By`. Злоумышленники могут использовать этот заголовок (включенный по умолчанию) для выявления приложений на базе Express и активации целенаправленных атак. It may
discourage a casual exploit, but there are other ways to determine an app is running
Express." %}

Express also sends its own formatted "404 Not Found" messages and formatter error
response messages. These can be changed by
[adding your own not found handler](/en/starter/faq.html#how-do-i-handle-404-responses)
and
[writing your own error handler](/en/guide/error-handling.html#writing-error-handlers):

```js
// last app.use calls right before app.listen():

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

## Безопасное использование cookie

Для того чтобы файлы cookie не подвергали опасности ваши приложения, не используйте стандартные имена сеансовых cookie и соответствующим образом настройте опции защиты файлов cookie.

Существует два основных сеансовых модуля cookie для промежуточной обработки:

- Модуль [express-session](https://www.npmjs.com/package/express-session), заменяющий собой промежуточный обработчик `express.session`, встроенный в Express 3.x.
- Модуль [cookie-session](https://www.npmjs.com/package/cookie-session), заменяющий собой промежуточный обработчик `express.cookieSession`, встроенный в Express 3.x.

Основное различие между этими двумя модулями состоит в способе сохранения сеансовых данных cookie. Промежуточный обработчик [express-session](https://www.npmjs.com/package/express-session) сохраняет данные о сеансе на сервере; в самом файле cookie сохраняется только ИД сеанса, но не данные сеанса. По умолчанию, используется хранилище в оперативной памяти, но данный способ не предназначен для рабочей среды. В рабочей среде необходимо настроить масштабируемое хранилище сеансов; см. список [совместимых хранилищ сеансов](https://github.com/expressjs/session#compatible-session-stores).

Промежуточный обработчик [cookie-session](https://www.npmjs.com/package/cookie-session), в отличие от описанного выше, реализует хранение на основе файлов cookie: выполняется полная сериализация сеанса в файл cookie, вместо того, чтобы сохранять только ключ сеанса. Этот способ следует использовать только при условии, что данные сеанса имеют относительно небольшой объем и легко могут быть преобразованы в элементарные значения (а не объекты). Хотя браузеры должны поддерживать не менее 4096 байт на каждый файл cookie, позаботьтесь о том, чтобы не допустить превышения данного ограничения. Размер не должен превышать 4093 байт на каждый домен. Кроме того, помните о том, что данные cookie являются видимыми для клиента, поэтому, если по какой-либо причине их следует защитить или скрыть, остановите свой выбор на модуле express-session как на более подходящем.

### Не используйте стандартные имена сеансовых cookie

Использование имен сеансовых cookie, предлагаемых по умолчанию, может сделать ваше приложение уязвимым для разного рода атак. В данном случае возникает та же проблема с безопасностью, что и при использовании заголовка `X-Powered-By`: потенциальный злоумышленник может воспользоваться им для идентификации на сервере и организации целенаправленных атак.

Для того чтобы избежать такой проблемы, используйте обобщенные имена cookie; например, при использовании промежуточного обработчика [express-session](https://www.npmjs.com/package/express-session):

```js
const session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 's3Cur3',
  name: 'sessionId'
})
)
```

### Настройка опций защиты cookie

Для обеспечения защиты необходимо настроить следующие опции защиты файлов cookie:

- `secure` - обеспечивает отправку файлов cookie браузером только с использованием протокола HTTPS.
- `httpOnly` - обеспечивает отправку cookie только с использованием протокола HTTP(S), а не клиентского JavaScript, что способствует защите от атак межсайтового скриптинга.
- `domain` - указывает домен cookie; используется для сравнения с доменом сервера, на котором запрашивается данный URL. В случае совпадения выполняется проверка следующего атрибута - пути.
- `path` - указывает путь cookie; используется для сравнения с путем запроса. Если путь и домен совпадают, выполняется отправка cookie в запросе.
- `expires` - используется для настройки даты окончания срока хранения для постоянных cookie.

Ниже приведен пример с использованием промежуточного обработчика [cookie-session](https://www.npmjs.com/package/cookie-session):

```js
const session = require('cookie-session')
const express = require('express')
const app = express()

const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'example.com',
    path: 'foo/bar',
    expires: expiryDate
  }
})
)
```

## Prevent brute-force attacks against authorization

Make sure login endpoints are protected to make private data more secure.

A simple and powerful technique is to block authorization attempts using two metrics:

1. The number of consecutive failed attempts by the same user name and IP address.
2. The number of failed attempts from an IP address over some long period of time. For example, block an IP address if it makes 100 failed attempts in one day.

[rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible) package provides tools to make this technique easy and fast. You can find [an example of brute-force protection in the documentation](https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection)

## Ensure your dependencies are secure

Using npm to manage your application's dependencies is powerful and convenient. But the packages that you use may contain critical security vulnerabilities that could also affect your application. The security of your app is only as strong as the "weakest link" in your dependencies.

Since npm@6, npm automatically reviews every install request. Also, you can use `npm audit` to analyze your dependency tree.

```bash
$ npm audit
```

If you want to stay more secure, consider [Snyk](https://snyk.io/).

Snyk offers both a [command-line tool](https://www.npmjs.com/package/snyk) and a [Github integration](https://snyk.io/docs/github) that checks your application against [Snyk's open source vulnerability database](https://snyk.io/vuln/) for any known vulnerabilities in your dependencies. Install the CLI as follows:

```bash
$ npm install -g snyk
$ cd your-app
```

Use this command to test your application for vulnerabilities:

```bash
$ snyk test
```

### Избегайте прочих известных уязвимостей

Следите за рекомендациями [Node Security Project](https://npmjs.com/advisories), касающимися Express или других модулей, используемых вашим приложением. В целом, Node Security Project - это непревзойденный ресурс, предоставляющий ценные знания и инструменты, связанные с безопасностью Node.

И наконец, приложения Express - как и любые другие приложения - могут быть уязвимы к разнообразным веб-атакам. Ознакомьтесь с описаниями известных [веб-уязвимостей](https://www.owasp.org/www-project-top-ten/) и примите соответствующие меры предосторожности, чтобы их избежать.

## Дополнительные замечания

Ниже приводится несколько дополнительных рекомендаций, взятых из исчерпывающего [Контрольного списка требований к защите Node.js](https://blog.risingstack.com/node-js-security-checklist/). В этой публикации можно найти дополнительную информацию по всем приведенным ниже рекомендациям:

- Всегда применяйте фильтрацию и очистку пользовательского ввода в целях защиты от атак межсайтового скриптинга (XSS) и ввода ложных команд.
- Обеспечьте защиту от атак внедрения SQL-кода с помощью параметризованных запросов или подготовленных операторов.
- Используйте инструмент [sqlmap](http://sqlmap.org/) с открытым исходным кодом для выявления уязвимостей к внедрению SQL-кода в приложение.
- Используйте инструменты [nmap](https://nmap.org/) и [sslyze](https://github.com/nabla-c0d3/sslyze) для проверки конфигурации шифров, ключей и повторных согласований SSL, а также действительности сертификата.
- Используйте [safe-regex](https://www.npmjs.com/package/safe-regex), чтобы убедиться в невосприимчивости регулярных выражений к атакам [отказа в обслуживании регулярных выражений](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS).

[helmet]: https://helmetjs.github.io/
