---
layout: page
title: Express ara yazılımı kullanmak
description: Learn how to use middleware in Express.js applications, including application-level and router-level middleware, error handling, and integrating third-party middleware.
menu: guide
lang: tr
redirect_from: /guide/using-middleware.html
---

# Using middleware

Express, kendine özgü minimal bir işlevselliği olan bir yönlendirme ve ara yazılım web çatısıdır: Bir Express uygulaması aslında bir dizi ara yazılım fonksiyon çağrısıdır.

_Middleware_ fonksiyonları, uygulamanın istek-yanıt döngüsündeki [istek objesi](/{{ page.lang }}/4x/api.html#req)  (`req`), [yanıt objesi](/{{ page.lang }}/4x/api.html#res) (`res`), ve bir sonraki ara yazılım fonksiyonuna erişebilen fonksiyonlardır. Bir sonraki ara yazılım fonksiyonu çoğunlukla `next` isimli bir değişken ile tanımlanır.

Ara yazılım fonksiyonları aşağıdaki görevleri yapabilir:

- Herhangi bir kodu koşma
- İstek ve yanıt objelerine değişiklik yapma
- İstek-yanıt döngüsünü bitirme
- Call the next middleware function in the stack.

Şimdiki ara yazılım fonksiyonu istek-yanıt döngüsünü bitirmezse, bir sonraki ara yazılım fonksiyonuna kontrol vermek için `next()` metodunu çağırmalı. Aksi takdirde istek boşta asılı kalacaktır.

Bir Express uygulaması aşağıdaki ara yazılım türlerini kullanabilir:

- [Uygulama-düzeyi ara yazılım](#middleware.application)
- [Rota-düzeyi ara yazılım](#middleware.router)
- [Hata-işleme ara yazılım](#middleware.error-handling)
- [Gömülü ara yazılım](#middleware.built-in)
- [Üçüncü-parti ara yazılım](#middleware.third-party)

Uygulama-düzeyi ve yönlendirici-düzeyi ara yazılımı bir opsiyonlu hedef yol ile yükleyebilirsiniz.
Hedef bir yolda, bir ara katman yazılımı alt kümesi oluşturacak bir ara yazılım fonksiyonlar dizisi de yükleyebilirsiniz.

<h2 id='middleware.application'>Uygulama-düzeyi ara yazılımı</h2>

Uygulama-düzeyi ara yazılımı `app.use()` ve `app.METHOD()` fonksiyonları kullanarak bir [uygulama objesi](/{{ page.lang }}/4x/api.html#app) örneğine bağlanır; `METHOD` ise, küçük harflerle, ara yazılım fonksiyonunun işlediği isteğin HTTP metodunun ismidir (örneğin GET, PUT, veya POST).

Bu örnek, hedef yolu bulunmayan bir ara yazılım fonksiyonunu gösteriyor. Fonksiyon uygulama her istek aldığında çalışır.

```js
const app = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```

Bu örnek, `/user/:id` yoluna yerleştirilmiş bir ara yazılım fonksiyonu gösterir. Bu fonksiyon `/user/:id` yoluna yapılan herhangi bir HTTP isteğinde çalışır.

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

Bu örnek bir rotayı ve işleyici fonksiyonunu gösterir (ara yazılım sistemi). Fonksiyon `/user/:id` yoluna yapılan GET isteklerini karşılıyor.

```js
app.get('/user/:id', (req, res, next) => {
  res.send('USER')
})
```

Bu örnek, hedef bir yol ile, yerleştirilmiş bir noktada bir dizi ara yazılım fonksiyonları yükler.
`/user/:id` yoluna yapılan herhangi bir tipte HTTP isteğinin istek bilgilerini yazdıran bir ara yazılım alt kümesini gösterir.

```js
app.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})
```

Rota işleyicileri bir yol için birden fazla rota tanımlamaya olanak sağlar. Aşağıdaki örnek `/user/:id` yoluna yapılan GET istekleri için iki rota tanımlıyor. İkinci rota herhangi bir problem yaratmayacak, ancak ilk rota istek-yanıt döngüsünü bitirdiği için ikinci rota hiç bir zaman çağrılmayacak.

Bu örnek `/user/:id` yoluna yapılan GET isteklerini işleyen ara yazılım alt kümesini gösterir.

```js
app.get('/user/:id', (req, res, next) => {
  console.log('ID:', req.params.id)
  next()
}, (req, res, next) => {
  res.send('User Info')
})

// kullanıcı ID'sini yazdıran, /user/:id yolunun işleyicisi
app.get('/user/:id', (req, res, next) => {
  res.end(req.params.id)
})
```

Kümedeki bir sonraki ara yazılım fonksiyonunu çağırma

**NOT**: `next('route')` metodu sadece `app.METHOD()` veya `router.METHOD()` fonksiyonlarını kullanarak yüklenen ara yazılım fonksiyonları için geçerlidir. %}

Bu örnek, `/user/:id` yoluna yapılan GET isteklerini işleyen bir ara yazılım alt-kümesini gösterir.

```js
app.get('/user/:id', (req, res, next) => {
  // kullanıcı ID'si 0 ise, bir sonraki rotaya geç
  if (req.params.id === '0') next('route')
  // aksi takdirde kontrolü bu kümedeki bir sonraki ara yazılım fonksiyonuna ver
  else next()
}, (req, res, next) => {
  // normal bir sayfa göster
  res.render('regular')
})

// özel bir sayfa gösteren, /user/:id yolunun işleyicisi
app.get('/user/:id', (req, res, next) => {
  res.render('special')
})
```

Middleware can also be declared in an array for reusability.

Bu örnek `express.static` ara yazılım fonksiyonunu ayrıntılı bir seçenekler objesiyle kullanımını gösterir:

```js
function logOriginalUrl (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}

function logMethod (req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

const logStuff = [logOriginalUrl, logMethod]
app.get('/user/:id', logStuff, (req, res, next) => {
  res.send('User Info')
})
```

<h2 id='middleware.router'>Router-level middleware</h2>

Yönlendirici-düzeyi ara yazılımı, uygulama-düzeyi ara yazılımı ile aynı şekilde çalışır; ama `express.Router()` sınıfının bir örneğine bağlıdır.

```js
const router = express.Router()
```

`router.use()` ve `router.METHOD()` fonksiyonlarını kullanarak yönlendirici-düzeyi ara yazılımı yükle.

Aşağıdaki örnek kod, yukarıda uygulama-düzeyi ara yazılım için gösterilen ara yazılım sistemini, yönlendirici-düzeyi ara yazılım kullanarak kopyalar:

```js
const app = express()
const router = express.Router()

// hedef yolu olmayan bir ara yazılım fonksiyonu. Bu kod yönlendiriciye yapılan her istekte çalışır
router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

// /user/:id yolu için yapılan herhangi bir HTTP tipi isteğinin istek bilgilerini gösteren bir ara yazılım alt-kümesi
router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

// /user/:id yoluna yapılan GET isteklerini işleyen bir ara yazılım alt-kümesi
router.get('/user/:id', (req, res, next) => {
  // kullanıcı ID'si 0 ise, bir sonraki yönlendiriciye geç
  if (req.params.id === '0') next('route')
  // aksi takdirde kontrolü bu kümedeki bir sonraki ara yazılıma ver
  else next()
}, (req, res, next) => {
  // normal bir sayfa göster
  res.render('regular')
})

// özel bir sayfa gösteren /user/:id yolu işleyicisi
router.get('/user/:id', (req, res, next) => {
  console.log(req.params.id)
  res.render('special')
})

// yönlendiriciyi uygulamaya yerleştir
app.use('/', router)
```

Yönlendiricinin kalan ara yazılım fonksiyonlarını geçmek için, yönlendirici örneğinden kontrolü almak için `next('router')` metodunu çağırın.

Bu örnek `/user/:id` yolu için yapılan GET isteklerini işleyen bir ara yazılım alt-kümesini gösterir.

```js
const app = express()
const router = express.Router()

// yönlendiriciyi bir kontrol ile doğrula ve gerektiğinde bir sonraki yönlendiriciye geçerek kurtul
router.use((req, res, next) => {
  if (!req.headers['x-auth']) return next('router')
  next()
})

router.get('/', (req, res) => {
  res.send('hello, user!')
})

// geçen herhangi bir şey için yönlendiriciyı ve 401'i kullan
app.use('/admin', router, (req, res) => {
  res.sendStatus(401)
})
```

<h2 id='middleware.error-handling'>Error-handling middleware</h2>

<div class="doc-box doc-notice" markdown="1">
Hata-işleyici ara yazılımı her zaman _dört_ argüman alır. Bir hata-işleyici ara yazılım fonksiyonunu tanımlayabilmek için dört argüman sağlamalısınız. `next` objesini kullanmaya ihtiyacınız yoksa bile, metod imzasını koruyabilmek için tanımlamalısınız. Aksi takdirde, `next` objesi normal bir ara yazılım gibi değerlendirilecek ve hataları işlemede başarısız olacaktır.
</div>

Hata-işleme ara yazılım fonksiyonlarını diğer ara yazılım fonksiyonları gibi tanımla, ancak istisna olarak üç argüman yerine 4 ile, özellikle `(err, req, res, next)` imzasıyla:

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Bir şeyler bozuk!')
})
```

Hata-işleyici ara yazılım hakkında daha fazla detay için bakınız [Hata-işleme](/{{ page.lang }}/guide/error-handling.html).

<h2 id='middleware.built-in'>Built-in middleware</h2>

4.x sürümünden başlayarak, Express [Connect](https://github.com/senchalabs/connect) ara yazılımına bağımlı değil. `express.static` hariç, Express ile daha önce dahil edilen tüm ara katman yazılımı fonksiyonları artık ayrı modüllerde. Lütfen bakınız [ara yazılım fonksiyonları listesi](https://github.com/senchalabs/connect#middleware).

Express has the following built-in middleware functions:

- Bu fonksiyon [serve-static](https://github.com/expressjs/serve-static)'e dayanır, ve HTML dosyaları, görüntüler vb. gibi statik dosyaları sunmaktan sorumludur.
- [express.json](/en/4x/api.html#express.json) parses incoming requests with JSON payloads. **NOTE: Available with Express 4.16.0+**
- [express.urlencoded](/en/4x/api.html#express.urlencoded) parses incoming requests with URL-encoded payloads.  **NOTE: Available with Express 4.16.0+**

<h2 id='middleware.third-party'>Üçüncü-parti ara yazılım</h2>

Express uygulamalarına işlevsellik katmak için üçüncü-parti ara yazılım kullan.

Gerekli işlevsellik için Node.js modülünü indir, ve daha sonra uygulamana uygulama-düzeyinde veya yönlendirici-düzeyinde yükle.

Aşağıdaki örnek `cookie-parser` çerez-ayrıştırma ara yazılım fonksiyonunu indirme ve yüklemeyi gösterir.

```bash
$ npm install cookie-parser
```

```js
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

// çerez-ayrıştırıcı ara yazılımı yükle
app.use(cookieParser())
```

Express ile yaygın olarak kullanılan üçüncü-parti ara yazılım fonksiyonlarının kısmi bir listesi için, bakınız: [Üçüncü-parti ara yazılım](../resources/middleware.html).
