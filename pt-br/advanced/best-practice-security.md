---
layout: page
title: Melhores Práticas de Segurança para o Express em Produção
description: Discover crucial security best practices for Express apps in production, including using TLS, input validation, secure cookies, and preventing vulnerabilities.
menu: advanced
lang: pt-br
redirect_from: /advanced/best-practice-security.html
---

# Melhores Práticas em Produção: Segurança

## Visão Geral

O termo _"produção"_ refere-se ao estágio no ciclo de vida do software onde um aplicativo ou API está geralmente
disponível para os seus usuários finais ou consumidores. Em contrapartida, no estágio de _"desenvolvimento"_,
você ainda está ativamente escrevendo e testando o código, e o aplicativo não está aberto para acesso externo. Os ambiente de sistema correspondentes são conhecidos como ambientes de _produção_ e _desenvolvimento_,
respectivamente.

Os ambientes de desenvolvimento e produção são geralmente
configurados de forma diferente e possuem requisitos completamente
diferentes. O que é bom em desenvolvimento pode não ser aceitável na produção. Por exemplo, em um ambiente de desenvolvimento você pode
desejar registros detalhados de erros para depuração, enquanto o
mesmo comportamento pode se tornar um risco de segurança em um
ambiente de produção. E em desenvolvimento, você não precisa se
preocupar com a escalabilidade, confiabilidade, e desempenho,
enquanto estas preocupações se tornam críticas na produção.

{% include admonitions/note.html content="If you believe you have discovered a security vulnerability in Express, please see
[Security Policies and Procedures](/en/resources/contributing.html#security-policies-and-procedures).
" %}

Este artigo discute algumas melhores práticas de segurança para
aplicativos do Express implementadas na produção.

- A [noSniff](https://github.com/helmetjs/dont-sniff-mimetype)
  configura o `X-Content-Type-Options` para evitar que os navegadores procurem por MIME uma resposta a partir do
  content-type declarado.
- [Use TLS](#use-tls)
- [Do not trust user input](#do-not-trust-user-input)
  - [Prevent open redirects](#prevent-open-redirects)
- [Use Helmet](#use-helmet)
- [Reduce fingerprinting](#reduce-fingerprinting)
- A [hsts](https://github.com/helmetjs/hsts) configura o cabeçalho `Strict-Transport-Security`
  que impinge conexões seguras (HTTP sobre SSL/TLS) com o servidor.
  - A principal diferença entre esses dois módulos é como eles salvam os dados de cookies de sessão.  O middleware [express-session](https://www.npmjs.com/package/express-session)
    armazena os dados da sessão no servidor; ele salva apenas o ID da
    sessão no cookie, não os dados da sessão.  Por padrão, ele usa
    armazenamento em memória e não é projetado para um ambiente de
    produção.  Em produção, será necessário configurar um armazenamento de
    sessão escalável; consulte a lista de armazenamentos
    de sessão compatíveis.
  - A [ieNoOpen](https://github.com/helmetjs/ienoopen) configura o `X-Download-Options` para o IE8+.
- [Prevent brute-force attacks against authorization](#prevent-brute-force-attacks-against-authorization)
- [Ensure your dependencies are secure](#ensure-your-dependencies-are-secure)
  - A [hidePoweredBy](https://github.com/helmetjs/hide-powered-by) remove o cabeçalho `X-Powered-By`.
- [Additional considerations](#additional-considerations)

## Não use versões descontinuadas ou vulneráveis do Express

Os Express 2.x e 3.x não são mais mantidos. Problemas de
segurança e desempenho nestas versões não serão corrigidos. Não use-as! Se
não tiver migrado para a versão 4, siga o [guia de migração](/{{ page.lang }}/guide/migrating-4.html).

Assegure-se também de que não esteja usando nenhuma das versões
vulneráveis do Express listadas na [Página de
atualizações de segurança](/{{ page.lang }}/advanced/security-updates.html). Se estiver, atualize para uma das
liberações estáveis, preferivelmente a mais recente.

## Use TLS

Se o seu aplicativo negocia com ou transmite dados sensíveis,
use a Segurança
da Camada de Transporte (TLS) para proteger a conexão e os
dados. Esta tecnologia criptografa os dados antes deles serem
enviados do cliente para o servidor, assim evitando alguns ataques
comuns (e fáceis). Apesar de solicitações Ajax e POST não parecerem
visivelmente óbvias e parecerem "ocultas" em navegadores, o seu
tráfego de rede é vulnerável a [sniffing de pacotes](https://en.wikipedia.org/wiki/Packet_analyzer) e
[ataques man-in-the-middle ](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

Você pode estar familiarizado com a criptografia Secure Sockets Layer(SSL). O
TLS é simplesmente a próxima progressão do. Em outras palavras, se você estava usando o SSL antes, considere fazer o
upgrade para o TLS. Em geral, recomendamos o Nginx para lidar com o TLS. Para
obter uma boa referência para configurar o TLS no Nginx (e outros servidores), consulte
Configurações
Recomendadas de Servidores (Mozilla Wiki).

Além disso, uma ferramenta útil para obter um certificado TLS
gratuito é a Let's
Encrypt, uma autoridade de certificação (CA) gratuita,
automatizada, e aberta fornecida pelo
Grupo de Pesquisas de
Segurança da Internet (ISRG).

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

## Use Helmet

O [Helmet](https://www.npmjs.com/package/helmet) pode
ajudar a proteger o seu aplicativo de algumas vulnerabilidades da web
bastante conhecidas configurando os cabeçalhos HTTP adequadamente.

O Helmet é na realidade apenas uma coleção de nove funções de
middlewares menores que configuram cabeçalhos HTTP relacionados à
segurança: Some examples include:

- `helmet.contentSecurityPolicy` which sets the `Content-Security-Policy` header. This helps prevent cross-site scripting attacks among many other things.
- `helmet.hsts` which sets the `Strict-Transport-Security` header. This helps enforce secure (HTTPS) connections to the server.
- A [frameguard](https://github.com/helmetjs/frameguard)
  configura o cabeçalho `X-Frame-Options` para fornecer proteção [clickjacking](https://www.owasp.org/index.php/Clickjacking). This provides [clickjacking](https://www.owasp.org/index.php/Clickjacking) protection.

Helmet includes several other middleware functions which you can read about [at its documentation website][helmet].

Instale o Helmet como qualquer outro módulo:

```bash
$ npm install --save helmet
```

Em seguida use-o no seu código:

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

Se não desejar usar o Helmet, então pelo menos desative o
cabeçalho `X-Powered-By`. Invasores podem utilizar
este cabeçalho (que fica ativado por padrão) para detectar
aplicativos executando o Express e então iniciar ataques
especificamente direcionados a eles. It may
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

## Use cookies de maneira segura

Para assegurar que os cookies não deixem o seu aplicativo
aberto a ataques, não use o cookie de sessão padrão e configure as
opções de segurança de cookies adequadamente.

Existem dois módulos de middleware principais para sessão de
cookies:

- [express-session](https://www.npmjs.com/package/express-session)
  que substitui o middleware `express.session`
  integrado no Express 3.x.
- [cookie-session](https://www.npmjs.com/package/cookie-session)
  que substitui o middleware `express.cookieSession` integrado no Express 3.x.

The main difference between these two modules is how they save cookie session data. The [express-session](https://www.npmjs.com/package/express-session) middleware stores session data on the server; it only saves the session ID in the cookie itself, not session data. By default, it uses in-memory storage and is not designed for a production environment. In production, you'll need to set up a scalable session-store; see the list of [compatible session stores](https://github.com/expressjs/session#compatible-session-stores).

Em contrapartida, o middleware [cookie-session](https://www.npmjs.com/package/cookie-session)
implementa um armazenamento apoiado em cookies: ele serializa a sessão inteira para o cookie, ao invés de apenas a chave da sessão.  Use apenas quando os dados da sessão são relativamente pequenos e facilmente codificados como números primitivos(ao invés de objetos). Only use it when session data is relatively small and easily encoded as primitive values (rather than objects). Apesar de navegadores supostamente suportarem pelo menos 4096 bytes por cookie, para assegurar que você não exceda o limite, não exceda
um tamanho de  4093 bytes por domínio. Além disso, esteja ciente de que os dados do cookie serão visíveis para o cliente, portanto se
houver razão para mantê-los seguros ou obscuros, então o express-session pode ser uma escolha melhor.

### Não use o nome do cookie da sessão padrão

Usando o nome do cookie da sessão padrão pode deixar o seu
aplicativo aberto a ataques. O problema de segurança levantado é
parecido ao do `X-Powered-By`: um invasor em
potencial poderia usá-lo para identificar o servidor e direcionar
ataques de acordo com ele.

Para evitar este problema, use nomes de cookie genéricos; por
exemplo usando o middleware [express-session](https://www.npmjs.com/package/express-session):

```js
const session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 's3Cur3',
  name: 'sessionId'
})
)
```

### Configure as opções de segurança de cookie

Configure as seguintes opções de cookie para aprimorar a
segurança:

- `secure` - Assegura que o navegador só envie o cookie por HTTPS.
- `httpOnly` - Assegura que o cookie seja enviado apenas por HTTP(S), não por cliente JavaScript, ajudando
  assim a se proteger contra ataques de cross-site scripting.
- `domain` - indica o domínio do cookie; use-o para comparação contra o domínio do servidor em que a URL está
  sendo solicitada. Se elas corresponderem, verifique o atributo de caminho em seguida.
- `path` - indica o caminho do cookie; use-o para comparação contra o caminho da solicitação. Se este e o domínio corresponderem, então envie o cookie na solicitação.
- `expires` - use para configurar uma data de
  expiração para cookies persistentes.

Aqui está um exemplo usando o middleware [cookie-session](https://www.npmjs.com/package/cookie-session):

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

### Evitar outras vulnerabilidades conhecidas

Fique atento às recomendações do
Node Security
Project que podem afetar o Express ou outros módulos usados
pelo seu aplicativo. Em geral, o Node Security Project é um excelente
recurso para conhecimento e ferramentas sobre segurança do Node.

Finalmente, os aplicativos do Express - como outros aplicativos web - podem estar vulneráveis a uma variedade de ataques baseados na
web. Familiarize-se com [vulnerabilidades web](https://www.owasp.org/www-project-top-ten/) conhecidas e tome precauções para evitá-las.

## Considerações adicionais

Aqui estão algumas recomendações adicionais da excelente Lista
de Verificação de Segurança do Node.js. Refira-se a esta postagem do blog para obter todos os detalhes destas recomendações:

- Sempre filtrar e limpar a entrada do usuário para se proteger de ataques de cross-site scripting (XSS) e injeção de comando.
- Proteja-se contra ataques de injeção de SQLs usando consultas parametrizadas ou instruções preparadas.
- Use a ferramenta de software livre [sqlmap](http://sqlmap.org/) para detectar
  vulnerabilidades de injeção de SQL no seu aplicativo.
- Use as ferramentas [nmap](https://nmap.org/) e [sslyze](https://github.com/nabla-c0d3/sslyze) para
  testar a configuração das suas cifras SSL, chaves, e renegociação, bem como a validade do seu certificado.
- Use o [safe-regex](https://www.npmjs.com/package/safe-regex) para assegurar que suas expressões regulares não estejam suscetíveis
  a ataques [negação de serviço de expressões regulares](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS).

[helmet]: https://helmetjs.github.io/
