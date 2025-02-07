---
layout: página
title: Actualizaciones de seguridad de Express
description: Revise las últimas actualizaciones de seguridad y los parches de Express.js, incluyendo listas detalladas de vulnerabilidades para diferentes versiones para ayudar a mantener una aplicación segura.
menu: avanzado
lang: es
redirect_from: /advanced/security-updates.html
---

# Actualizaciones de seguridad

<div class="doc-box doc-notice" markdown="1">
Las vulnerabilidades de Node.js afectan directamente a Express. Por lo tanto, [vigile las vulnerabilidades de Node.js](https://nodejs.org
/en/blog/vulnerability/) y asegúrese de utilizar la versión estable más reciente de Node.js.
</div>

En la lista siguiente se muestran las vulnerabilidades de Express que se han solucionado en la actualización de versión especificada.

**NOTA**: Si crees que has descubierto una vulnerabilidad de seguridad en Express, consulta
[Políticas de Seguridad y Procedimientos](/{{page.lang}}/resources/contributing.html#security-policies-and-procedures).

## 4 x

- 4.16.0
  - La dependencia `forwarded` ha sido actualizada para direccionar un [vulnerability](https://npmjs.com/advisories/527). Esto puede afectar a su aplicación si se utilizan las siguientes API: `req.host`, `req.hostname`, `req.ip`, `req.ips`, `req.protocol`.
  - La dependencia `mime` ha sido actualizada para abordar un [vulnerability](https://npmjs.com/advisories/535), pero este problema no afecta a Express.
  - La dependencia `send` ha sido actualizada para proporcionar una protección contra una [vulnerabilidad de Node.js 8.5.0](https://nodejs.org/en/blog/vulnerability/september-2017-path-validation/). Esto sólo afecta a la ejecución de Express en la versión 8.5.0 específica de Node.js.
- 4.15.5
  - La dependencia `debug` ha sido actualizada para abordar un [vulnerability](https://snyk.io/vuln/npm:debug:20170905), pero este problema no afecta a Express.
  - La dependencia `fresh` ha sido actualizada para direccionar un [vulnerability](https://npmjs.com/advisories/526). Esto afectará a tu aplicación si se utilizan las siguientes API: `express.static`, `req.fresh`, `res.json`, `res.jsonp`, `res.send`, `res.sendfile` `res.sendFile`, `res.sendStatus`.
- 4.15.3
  - La dependencia `ms` ha sido actualizada para direccionar un [vulnerability](https://snyk.io/vuln/npm:ms:20170412). Esto puede afectar a tu aplicación si la entrada de cadena no confiable es pasada a la opción `maxAge` en las siguientes APIs: `express.static`, `res.sendfile`, y `res.sendFile`.
- 4.15.2
  - La dependencia `qs` ha sido actualizada para abordar un [vulnerability](https://snyk.io/vuln/npm:qs:20170213), pero este problema no afecta a Express. Actualizar a 4.15.2 es una buena práctica, pero no es necesario para abordar la vulnerabilidad.
- 4.11.1
  - Se ha solucionado la vulnerabilidad de divulgación de vía de acceso raíz en `express.static`, `res.sendfile` y `res.sendFile`
- 4.10.7
  - Se ha solucionado la vulnerabilidad de Open Redirect en `express.static` ([anuncio](https://npmjs.com/advisories/35), [CVE-2015-1164](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-1164)).
- 4.8.8
  - Se han solucionado las vulnerabilidades de cruce de directorios en `express.static` ([anuncio](http://npmjs.com/advisories/32) , [CVE-2014-6394](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-6394)).
- 4.8.4
  - Node.js 0.10 puede tener fugas de `fd` en determinadas situaciones que afectan a `express.static` y `res.sendfile`. Las solicitudes maliciosas pueden provocar la fuga de `fd` y, en última instancia, generar errores `EMFILE` y anular la capacidad de respuesta del servidor.
- 4.8.0
  - Las matrices dispersas que tienen índices extremadamente altos en la serie de consulta pueden hacer que el proceso se quede sin memoria y se bloquee el servidor.
  - Los objetos de serie de consulta extremadamente anidados pueden hacer que se bloquee el proceso y anular la capacidad de respuesta del servidor temporalmente.

## 3.x

  <div class="doc-box doc-warn" markdown="1">
  **Express 3.x ES END-OF-LIFE Y NINGUNA LONGERA MAINTAINADA**

Los problemas de seguridad y rendimiento conocidos y desconocidos en 3.x no han sido abordados desde la última actualización (1 de agosto de 2015). Es altamente recomendable utilizar la última versión de Express.

Si no puedes actualizar más allá de la versión 3.x, por favor considera [Opciones de soporte comercial](/{{ page.lang }}/support#commercial-support-options).

  </div>

- 3.19.1
  - Se ha solucionado la vulnerabilidad de divulgación de vía de acceso raíz en `express.static`, `res.sendfile` y `res.sendFile`
- 3.19.0
  - Se ha solucionado la vulnerabilidad de Open Redirect en `express.static` ([anuncio](https://npmjs.com/advisories/35), [CVE-2015-1164](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-1164)).
- 3.16.10
  - Se han solucionado las vulnerabilidades de cruce de directorios en `express.static`.
- 3.16.6
  - Node.js 0.10 puede tener fugas de `fd` en determinadas situaciones que afectan a `express.static` y `res.sendfile`. Las solicitudes maliciosas pueden provocar la fuga de `fd` y, en última instancia, generar errores `EMFILE` y anular la capacidad de respuesta del servidor.
- 3.16.0
  - Las matrices dispersas que tienen índices extremadamente altos en la serie de consulta pueden hacer que el proceso se quede sin memoria y se bloquee el servidor.
  - Los objetos de serie de consulta extremadamente anidados pueden hacer que se bloquee el proceso y anular la capacidad de respuesta del servidor temporalmente.
- 3.3.0
  - La respuesta 404 de un intento de alteración temporal de método no soportado era susceptible de ataques de scripts entre sitios.
