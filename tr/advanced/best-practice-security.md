---
layout: page
title: Canlı Ortamda Express için En İyi Güvenlik Pratikleri
description: Discover crucial security best practices for Express apps in production, including using TLS, input validation, secure cookies, and preventing vulnerabilities.
menu: advanced
lang: tr
redirect_from: /advanced/best-practice-security.html
---

# En İyi Canlı Ortam Pratikleri: Güvenlik

## Genel Bakış

_"canlı ortam"_ terimi, bir uygulama veya API'nin genel olarak son kullanıcıları veya tüketicileri için hazır olduğu yazılım yaşam döngüsündeki aşamayı ifade eder. Buna kıyasla, _"geliştirme"_ aşamasında aktif olarak kod yazıyor ve test ediyorsunuz, ve uygulama dış erişime açık değildir. Bunlara karşılık gelen sistem ortamları sırasıyla _canlı ortam (production)_ ve _geliştirme (development)_ ortamları olarak bilinir.

Canlı ve geliştirme ortamları genel olarak farklı şekilde kurulurlar ve çok farklı gereksinimleri vardır. Geliştirme ortamında iyi olan bir şey canlı ortamda kabul edilebilir olmayabilir. Örneğin, geliştirme ortamında hata ayıklama için ayrıntılı hataların loglanmasını isteyebilirsiniz, ancak aynı şey canlı ortamda güvenlik açığı oluşturabilir. Ve geliştirme ortamında ölçeklenebilirlik, güvenilirlik ve performans hakkında endişe etmenize gerek yok iken, bu konular canlı ortamda kritikleşir.

{% include admonitions/note.html content="Express'te bir güvenlik açığı keşfettiğinizi düşünüyorsanız, lütfen bakınız
[Güvenlik Politikaları ve Prosedürleri](https://github.com/expressjs/express/blob/master/Security.md).
" %}

Canlı ortamdaki Express uygulamaları için en iyi güvenlik pratikleri:

- [Express'in kullanımdan kaldırılmış veya bakımı yapılmayan versiyonlarını kullanmayın](#expressin-kullanımdan-kaldırılmış-veya-bakımı-yapılmayan-versiyonlarını-kullanmayın)
- [TLS kullanın](#tls-kullanın)
- [Do not trust user input](#do-not-trust-user-input)
  - [Prevent open redirects](#prevent-open-redirects)
- [Helmet kullanın](#helmet-kullanın)
- [Reduce fingerprinting](#reduce-fingerprinting)
- [Çerezleri güvenli kullanın](#çerezleri-güvenli-kullanın)
  - [ieNoOpen](https://github.com/helmetjs/ienoopen) IE8+ için `X-Download-Options` başlığını ayarlar.
  - [Set cookie security options](#set-cookie-security-options)
- [Otorizasyona karşı yapılan brute-force saldırılarını engelleyin](#otorizasyona-karşı-yapılan-brute-force-saldırılarını-engelleyin)
- [Bağımlılıklarınızın güvende olduğundan emin olun](#bağımlılıklarınızın-güvende-olduğundan-emin-olun)
  - [Avoid other known vulnerabilities](#avoid-other-known-vulnerabilities)
- [Additional considerations](#additional-considerations)

## Express'in kullanımdan kaldırılmış veya bakımı yapılmayan versiyonlarını kullanmayın

Express 2.x ve 3.x versiyonlarının bakımı artık yapılmıyor. Bu versiyonlardaki güvenlik ve performans sorunları çözülmeyecek. Bunları kullanmayın! versiyona henüz geçmediyseniz, [taşıma rehberini](/{{ page.lang }}/guide/migrating-4.html) takip edin.

Ayrıca [güvenlik güncellemeleri sayfası](/{{ page.lang }}/advanced/security-updates.html)'nda listelenen bakımı yapılmayan herhangi bir Express versiyonunu kullanmadığınızdan emin olun. Eğer kullanıyorsanız, stabil versiyonlardan birine geçin, tercihen en son versiyona.

## TLS kullanın

Uygulamanız hassas verilerle ilgileniyor veya bunları iletiyorsa, veri ve bağlantıyı güvende tutmak için [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) kullanın. Bu teknoloji, verileri istemciden sunucuya gönderilmeden önce şifreler ve böylelikle bazı yaygın (ve kolay) saldırıları önler. Ajax ve POST istekleri gözle görülür şekilde açık olmayabilir ve tarayıcılarda "gizli" görünebilir, ancak bunların ağ trafiği [packet sniffing](https://en.wikipedia.org/wiki/Packet_analyzer) ve [man-in-the-middle saldırılarına](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) karşı korumasızdır.

Secure Socket Layer (SSL) şifrelemesine aşina olabilirsiniz. [TLS, SSL'nin bir sonraki geçişidir](https://msdn.microsoft.com/en-us/library/windows/desktop/aa380515\(v=vs.85\).aspx). Bir başka deyişle, daha önce SSL kullanıyorsanız TLS'e yükseltmeyi düşünün. Genel olarak, TLS kullanmak için Nginx öneririz. Nginx'te (ve diğer sunucularda) TLS'yi yapılandırmak için, bakınız [Önerilen Sunucu Yapılandırmaları (Mozilla Wiki)](https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_Server_Configurations).

Ayrıca, [Internet Security Research Group (ISRG)](https://www.abetterinternet.org/) tarafından sunulan ücretsiz, otomatik, ve açık bir sertifika yetkilisi (CA - Certificate Authority) olan [Let's Encrypt](https://letsencrypt.org/about/) ücretsiz bir TLS sertifikası alabileceğiniz araçtır.

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

## Helmet kullanın

[Helmet](https://www.npmjs.com/package/helmet), HTTP başlıklarını doğru ayarlayarak uygulamanızı bazı iyi bilinen web güvenlik açıklarına karşı koruyabilir.

Helmet aslında güvenlikle ilgili HTTP yanıt başlıklarını ayarlayan, daha küçük ara yazılım (middleware) fonksiyonlarından oluşan bir koleksiyondur: Some examples include:

- `helmet.contentSecurityPolicy` which sets the `Content-Security-Policy` header. This helps prevent cross-site scripting attacks among many other things.
- `helmet.hsts` which sets the `Strict-Transport-Security` header. This helps enforce secure (HTTPS) connections to the server.
- [frameguard](https://github.com/helmetjs/frameguard) [clickjacking](https://www.owasp.org/index.php/Clickjacking) koruması sağlamak için `X-Frame-Options` başlığını ayarlar. This provides [clickjacking](https://www.owasp.org/index.php/Clickjacking) protection.

Helmet includes several other middleware functions which you can read about [at its documentation website][helmet].

Helmet'ı diğer herhangi bir modül gibi kurun:

```bash
$ npm install --save helmet
```

Daha sonra kodunuzda kullanmak için:

```js
// ...

const helmet = require('helmet')
app.use(helmet())

// ...
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

{% include admonitions/note.html content="X-Powered-By başlığının devre dışı bırakılması, tecrübeli bir saldırganın bir uygulamanın Express çalıştırdığını belirlemesini önlemez. Bu, sıradan bir istismarı engelleyebilir, ancak bir uygulamanın Express çalıştırdığını belirlemenin başka yolları da var. "%}

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

## Çerezleri güvenli kullanın

Çerezlerin uygulamanızı istismarlara açmamasını sağlamak için, varsayılan oturum çerez adını kullanmayın ve çerez güvenlik seçeneklerini uygun şekilde ayarlayın.

İki ana ara yazılım çerez oturum modülü var:

- [express-session](https://www.npmjs.com/package/express-session), Express 3.x versiyonlarında yer alan `express-session` yerleşik (built-in) ara yazılımının yerini alır.
- [cookie-session](https://www.npmjs.com/package/cookie-session), Express 3.x versiyonlarında yer alan `express.cookieSession` yerleşik ara yazılımının yerini alır.

Bu iki modülün arasındaki ana fark, çerez oturum verisinin nasıl kaydedildiğidir. [express-session](https://www.npmjs.com/package/express-session) ara yazılımı oturum verisini sunucuda tutar; sadece oturum ID'sini çerezde tutar, oturum verisini değil. Varsayılan olarak, iç-bellek depolamayı kullanır ve canlı ortam için tasarlanmamıştır. Canlı ortamda, ölçeklenebilir bir oturum depolamayı kurmanız gerekecektir; [uyumlu oturum depolarını](https://github.com/expressjs/session#compatible-session-stores)'nı görmek için bakınız.

Buna kıyasla, [cookie-session](https://www.npmjs.com/package/cookie-session) ara yazılımı çerez-destekli depolamayı uygular: sadece bir oturum anahtarı yerine,  tüm oturumu çerezde serileştirir. Bunu yalnızca oturum verileri nispeten küçük olduğunda ve ilkel (primitive) değerler (objeler yerine) olarak kolayca kodlandığında kullanın. Tarayıcıların çerez başına en az 4096 baytı desteklemesine rağmen, limiti aşmamanızdan emin olmak için domain başına 4093 baytı aşmayın. Ayrıca, çerez verilerinin istemciye açık olacağını unutmayın, bu yüzden verilerin güvenli veya gizli olması için herhangi bir neden var ise, express-session daha iyi bir seçenek olabilir.

### Varsayılan oturum çerez adını kullanmayın

Varsayılan oturum çerez adı uygulamanızı saldırılara açık bırakabilir. Ortaya çıkan güvenlik sorunu `X-Powered-By` sorununa benzer: potansiyel bir saldırgan, sunucunun parmak izini almak ve saldırıları buna göre hedeflemek için kullanabilir.

Bu problemi önlemek için, jenerik çerez adlarını kullanın; örnek olarak [express-session](https://www.npmjs.com/package/express-session) ara yazılımının kullanımı:

```js
const session = require('express-session')
app.set('trust proxy', 1)
app.use(session({
  secret: 's3Cur3',
  name: 'sessionId'
}))
```

### Çerez güvenlik seçeneklerini ayarlayın

Güvenliği artırmak için aşağıdaki çerez seçeneklerini ayarlayın:

- `secure` - Tarayıcının çerezi yalnızca HTTPS üzerinden göndermesini sağlar.
- `httpOnly` - Çerezin JavaScript istemcisinden değil, yalnızca HTTP(S) üzerinden gönderilmesini sağlar ve böylelikle siteler arası komut dosyası çalıştırma saldırılarına karşı korumaya yardımcı olur.
- `domain` - çerezin alan adını belirtir; URL'nin istendiği sunucunun alan adıyla karşılaştırmak için kullanın. Eğer eşleşiyorsa, ardından yol (path) alanını kontrol edin.
- `path` - çerezin yolunu belirtir; bunu istek yoluyla karşılaştırmak için kullanın. Eğer bu ve alan adı eşleşiyorsa, istekte çerezi gönderebilirsiniz.
- `expires` - kalıcı çerezler için son kullanma tarihini ayarlamak için kullanın.

[cookie-session](https://www.npmjs.com/package/cookie-session) ara yazılımını kullanan bir örnek:

```js
const session = require('cookie-session')
const express = require('express')
const app = express()

const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 saat
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
}))
```

## Otorizasyona karşı yapılan brute-force saldırılarını engelleyin

Özel verileri daha güvenli hale getirmek için giriş uç noktalarının (endpoint) korunduğundan emin olun.

Basit ve güçlü bir teknik olarak iki ölçüm kullanarak yetkilendirme girişimlerini engellemektir:

1. Birincisi, aynı kullanıcı adı ve IP adresi ile art arda başarısız denemelerin sayısı.
2. İkincisi, uzun bir süre boyunca bir IP adresinden başarısız denemelerin sayısıdır. Örneğin, bir IP adresi bir günde 100 başarısız deneme yaparsa engelleyin.

[rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible) paketi bu tekniği kolay ve hızlıca uygulamak için gerekli araçları sağlar. [brute-force korumasına bir örneği bu dökümantasyonda bulabilirsiniz](https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection).

## Bağımlılıklarınızın güvende olduğundan emin olun

Uygulamanızın bağımlılıklarını yönetmek için npm kullanmak güçlü ve kullanışlıdır. Ancak kullandığınız paketler, uygulamanızı da etkileyebilecek kritik güvenlik açıkları içerebilir. Uygulamanızın güvenliği, bağımlılıklarınızdaki "en zayıf halka" kadar güçlüdür.

npm@6'dan beri npm otomatik olarak her yükleme isteğini inceler. Ayrıca 'npm audit' komutunu kullanarak bağımlılık ağacınızı analiz edebilirsiniz.

```bash
$ npm audit
```

Daha fazla güvenli kalmak istiyorsanız, [Snyk](https://snyk.io/) aracını gözden geçirebilirsiniz.

Bağımlılıklarınızdaki bilinen tüm güvenlik açıkları için [Synk'in açık kaynak güvenlik açığı veritabanı](https://snyk.io/vuln/)'na karşı uygulamanızı kontrol eden bir [komut satırı aracı](https://www.npmjs.com/package/snyk) ve de [Github integrasyonu](https://snyk.io/docs/github) sunar. Install the CLI as follows:

```bash
$ npm install -g snyk
$ cd your-app
```

Uygulamanızı güvenlik açıklarına karşı test etmek için bu komutu kullanın:

```bash
$ snyk test
```

### Bilinen diğer güvenlik açıklarından kaçının

Express'i veya uygulamanızın kullandığı diğer modülleri etkileyen [Snyk](https://snyk.io/vuln/) ve [Node Security Project](https://npmjs.com/advisories) tavsiyelerini takipte kalın. Genel olarak, bu veritabanları Node güvenliği hakkında bilgi ve araçlar için mükemmel kaynaklardır.

Son olarak, Express uygulamaları - diğer web uygulamaları gibi - çeşitli web tabanlı saldırılara karşı savunmasız olabilir. [Web güvenlik açıkları](https://www.owasp.org/www-project-top-ten/) hakkında kendinizi bilgilendirin ve onlardan kaçınmak için önlemler alın.

## Ek hususlar

İşte mükemmel [Node.js Güvenlik Kontrol Listesi](https://blog.risingstack.com/node-js-security-checklist/)'nden bazı ek öneriler. Bu önerilerle ilgili tüm ayrıntılar için o blog gönderisine bakın:

- Siteler arası komut dosyası oluşturma (XSS) ve komut enjeksiyon saldırılarına karşı korumak için kullanıcı girişini her zaman filtreleyin ve sanitize edin.
- Parametreli sorgular veya hazırlanmış ifadeler kullanarak SQL enjeksiyon saldırılarına karşı savunma yapın.
- Uygulamanızdaki SQL enjeksion güvenlik açıklarını tespit etmek için açık kaynak olan [sqlmap](http://sqlmap.org/) aracını kullanın.
- Sertifikanızın geçerliliğini kontrol etmenin yanında SSL şifrelerinin ve anahtarlarının konfigürasyonunu test etmek için [nmap](https://nmap.org/) ve [sslyze](https://github.com/nabla-c0d3/sslyze) araçlarını kullanın.
- Use [safe-regex](https://www.npmjs.com/package/safe-regex) to ensure your regular expressions are not susceptible to [Regular expression Denial of Service (ReDoS)](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS) attacks.

[helmet]: https://helmetjs.github.io/
