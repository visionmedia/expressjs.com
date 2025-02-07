---
layout: page
title: Proxy arkasında Express
description: Learn how to configure Express.js applications to work correctly behind reverse proxies, including using the trust proxy setting to handle client IP addresses.
menu: guide
lang: tr
redirect_from: /guide/behind-proxies.html
---

# Proxy arkasında Express

When running an Express app behind a reverse proxy, some of the Express APIs may return different values than expected. In order to adjust for this, the `trust proxy` application setting may be used to expose information provided by the reverse proxy in the Express APIs. The most common issue is express APIs that expose the client's IP address may instead show an internal IP address of the reverse proxy.

<div class="doc-box doc-info" markdown="1">
When configuring the `trust proxy` setting, it is important to understand the exact setup of the reverse proxy. Since this setting will trust values provided in the request, it is important that the combination of the setting in Express matches how the reverse proxy operates.
</div>

Bir proxy'nin arkasında bir Express uygulaması koşulduğunda, ([app.set()](/{{ page.lang }}/4x/api.html#app.set) kullanarak) `trust proxy` uygulama değişkenine aşağıdaki tabloda listelenen değerlerden birini verin.

<table class="doctable" border="1" markdown="1">
  <thead><tr><th>Type</th><th>Değer</th></tr></thead>
  <tbody>
    <tr>
      <td>Boolean</td>
<td markdown="1">
`true` olduğunda, istemci IP adresi `X-Forwarded-*` başlığında en soldaki giriş olarak değerlendirilir.

`false` olduğunda, uygulama direkt olarak Internete dönük olacak ve istemci IP adresi ise `req.connection.remoteAddress` alanından alınmış olacak. Bu varsayılan ayardır.

<div class="doc-box doc-warn" markdown="1">
When setting to `true`, it is important to ensure that the last reverse proxy trusted is removing/overwriting all of the following HTTP headers: `X-Forwarded-For`, `X-Forwarded-Host`, and `X-Forwarded-Proto`, otherwise it may be possible for the client to provide any value.
</div>
</td>
    </tr>
    <tr>
      <td>IP addresses</td>
<td markdown="1">
An IP address, subnet, or an array of IP addresses and subnets to trust as being a reverse proxy. The following list shows the pre-configured subnet names:

- loopback - `127.0.0.1/8`, `::1/128`
- linklocal - `169.254.0.0/16`, `fe80::/10`
- uniquelocal - `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `fc00::/7`

IP adreslerini aşağıdaki yöntemlerden herhangi biriyle ayarlayabilirsiniz:

```js
app.set('trust proxy', 'loopback') // tek bir alt ağ tanımla
app.set('trust proxy', 'loopback, 123.123.123.123') // bir adres ve bir alt ağ tanımla
app.set('trust proxy', 'loopback, linklocal, uniquelocal') // birden çok alt ağları CVS olarak tanımla
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']) // bir dizi olarak birden çok alt ağ tanımla
```

Belirtildiğinde, IP adresleri veya alt ağlar adres belirleme işleminin dışında bırakılır ve uygulama sunucusuna en yakın güvenilmeyen IP adresi, istemcinin IP adresi olarak belirlenir. This works by checking if `req.socket.remoteAddress` is trusted. If so, then each address in `X-Forwarded-For` is checked from right to left until the first non-trusted address.

</td>
    </tr>
    <tr>
      <td>Sayı</td>
<td markdown="1">
Use the address that is at most `n` number of hops away from the Express application. `req.socket.remoteAddress` is the first hop, and the rest are looked for in the `X-Forwarded-For` header from right to left. A value of `0` means that the first untrusted address would be `req.socket.remoteAddress`, i.e. there is no reverse proxy.

<div class="doc-box doc-warn" markdown="1">
When using this setting, it is important to ensure there are not multiple, different-length paths to the Express application such that the client can be less than the configured number of hops away, otherwise it may be possible for the client to provide any value.
</div>
</td>
    </tr>
    <tr>
      <td>Function</td>
<td markdown="1">
Custom trust implementation.

```js
app.set('trust proxy', (ip) => {
  if (ip === '127.0.0.1' || ip === '123.123.123.123') return true // güvenilen IP'ler
  else return false
})
```

</td>
    </tr>
  </tbody>
</table>

`trust proxy` ayarını etkinleştirmenin etkileri aşağıdaki gibidir:

<ul>
  <li markdown="1">[req.hostname](/{{ page.lang }}/api.html#req.hostname) alanının değeri, istemci veya proxy tarafından ayarlanabilen `X-Forwarded-Host` başlığındaki değerler kümesinden alınacak.
  </li>
  <li markdown="1">`X-Forwarded-Proto` değeri; `https`, `http` veya geçersiz bir ad olduğunu uygulamaya belirtmesi için ters proxy tarafından ayarlanabilir. Bu değer, [req.protocol](/{{ page.lang }}/api.html#req.protocol) tarafından yansıtılır.
  </li>
  <li markdown="1">[req.ip](/{{ page.lang }}/api.html#req.ip) ve [req.ips](/{{ page.lang }}/api.html#req.ips) alanlarının değerleri, `X-Forwarded-For` başlığındaki adres listesi ile doldurulur.
  </li>
</ul>

`trust proxy` ayarı [proxy-addr](https://www.npmjs.com/package/proxy-addr) paketi kullanılarak uygulanmıştır. Daha fazla bilgi için, dökümantasyonuna bakınız.
