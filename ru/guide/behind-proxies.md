---
layout: page
title: Express за прокси
description: Learn how to configure Express.js applications to work correctly behind reverse proxies, including using the trust proxy setting to handle client IP addresses.
menu: guide
lang: ru
redirect_from: /guide/behind-proxies.html
---

# Express за прокси

When running an Express app behind a reverse proxy, some of the Express APIs may return different values than expected. In order to adjust for this, the `trust proxy` application setting may be used to expose information provided by the reverse proxy in the Express APIs. The most common issue is express APIs that expose the client's IP address may instead show an internal IP address of the reverse proxy.

<div class="doc-box doc-info" markdown="1">
When configuring the `trust proxy` setting, it is important to understand the exact setup of the reverse proxy. Since this setting will trust values provided in the request, it is important that the combination of the setting in Express matches how the reverse proxy operates.
</div>

При запуске приложения Express за прокси-сервером, необходимо указать (с помощью [app.set()](/{{ page.lang }}/4x/api.html#app.set)) для переменной приложения `trust proxy` одно из значений, приведенных в таблице ниже.

<table class="doctable" border="1" markdown="1">
  <thead><tr><th>Тип</th><th>Значение</th></tr></thead>
  <tbody>
    <tr>
      <td>Boolean</td>
<td markdown="1">
Если указано значение `true`, клиентским IP-адресом считается первая слева запись в заголовке `X-Forwarded-*`.

Если указано значение `false`, приложение считается имеющим прямой выход в Интернет, и IP-адрес клиента будет производным от `req.connection.remoteAddress`. Это значение используется по умолчанию.

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

IP-адреса можно задать любым из указанных ниже способов:

```js
app.set('trust proxy', 'loopback') // specify a single subnet
app.set('trust proxy', 'loopback, 123.123.123.123') // specify a subnet and an address
app.set('trust proxy', 'loopback, linklocal, uniquelocal') // specify multiple subnets as CSV
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']) // specify multiple subnets as an array
```

Если IP-адреса или подсети указаны, они исключаются из процесса определения адреса, и незащищенный IP-адрес, ближайший к серверу приложений, будет определен как IP-адрес клиента. This works by checking if `req.socket.remoteAddress` is trusted. If so, then each address in `X-Forwarded-For` is checked from right to left until the first non-trusted address.

</td>
    </tr>
    <tr>
      <td>Число</td>
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
  if (ip === '127.0.0.1' || ip === '123.123.123.123') return true // trusted IPs
  else return false
})
```

</td>
    </tr>
  </tbody>
</table>

Enabling `trust proxy` will have the following impact:

<ul>
  <li markdown="1">Значение [req.hostname](/{{ page.lang }}/api.html#req.hostname) является производным от значения, указанного в заголовке `X-Forwarded-Host`, который может быть задан клиентом или прокси.
  </li>
  <li markdown="1">Заголовок `X-Forwarded-Proto` может быть задан обратным прокси-сервером и указывает приложению на использование протокола `https`, или  `http`, или даже недопустимого имени. Это значение отражается в [req.protocol](/{{ page.lang }}/api.html#req.protocol).
  </li>
  <li markdown="1">Значения [req.ip](/{{ page.lang }}/api.html#req.ip) и [req.ips](/{{ page.lang }}/api.html#req.ips) заполняются собой списком адресов, взятых из `X-Forwarded-For`.
  </li>
</ul>

Параметр `trust proxy` реализуется с помощью пакета [proxy-addr](https://www.npmjs.com/package/proxy-addr). Дополнительная информация приведена в документации к нему.
