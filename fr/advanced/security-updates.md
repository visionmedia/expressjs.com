---
layout: page
title: Express security updates
description: Review the latest security updates and patches for Express.js, including detailed vulnerability lists for different versions to help maintain a secure application.
menu: advanced
lang: fr
redirect_from: /advanced/security-updates.html
---

# Mises à jour de sécurité

<div class="doc-box doc-notice" markdown="1">
Les vulnérabilités Node.js affectent directement Express. Cependant, [gardez un oeil sur les vulnérabilités Node.js](https://nodejs.org
/en/blog/vulnerability/) et assurez-vous d'utiliser la dernière version stable de Node.js.
</div>

La liste ci-dessous répertorie les vulnérabilités Express qui ont été corrigées dans la mise à jour de la version spécifiée.

**NOTE**: If you believe you have discovered a security vulnerability in Express, please see
[Security Policies and Procedures](/{{page.lang}}/resources/contributing.html#security-policies-and-procedures).

## 4.x

- 4.16.0
  - The dependency `forwarded` has been updated to address a [vulnerability](https://npmjs.com/advisories/527). This may affect your application if the following APIs are used: `req.host`, `req.hostname`, `req.ip`, `req.ips`, `req.protocol`.
  - The dependency `mime` has been updated to address a [vulnerability](https://npmjs.com/advisories/535), but this issue does not impact Express.
  - The dependency `send` has been updated to provide a protection against a [Node.js 8.5.0 vulnerability](https://nodejs.org/en/blog/vulnerability/september-2017-path-validation/). This only impacts running Express on the specific Node.js version 8.5.0.
- 4.15.5
  - The dependency `debug` has been updated to address a [vulnerability](https://snyk.io/vuln/npm:debug:20170905), but this issue does not impact Express.
  - The dependency `fresh` has been updated to address a [vulnerability](https://npmjs.com/advisories/526). This will affect your application if the following APIs are used: `express.static`, `req.fresh`, `res.json`, `res.jsonp`, `res.send`, `res.sendfile` `res.sendFile`, `res.sendStatus`.
- 4.15.3
  - The dependency `ms` has been updated to address a [vulnerability](https://snyk.io/vuln/npm:ms:20170412). This may affect your application if untrusted string input is passed to the `maxAge` option in the following APIs: `express.static`, `res.sendfile`, and `res.sendFile`.
- 4.15.2
  - The dependency `qs` has been updated to address a [vulnerability](https://snyk.io/vuln/npm:qs:20170213), but this issue does not impact Express. Updating to 4.15.2 is a good practice, but not required to address the vulnerability.
- 4.11.1
  - Correction de la vulnérabilité de divulgation de racine dans `express.static`, `res.sendfile` et `res.sendFile`
- 4.10.7
  - Correction de la vulnérabilité de redirection ouverte dans `express.static` ([advisory](https://npmjs.com/advisories/35), [CVE-2015-1164](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-1164)).
- 4.8.8
  - Correction des vulnérabilités de traversée de répertoire dans `express.static` ([advisory](http://npmjs.com/advisories/32) , [CVE-2014-6394](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-6394)).
- 4.8.4
  - Node.js 0.10 peut divulguer des `fd` dans certaines situations qui affectent `express.static` et `res.sendfile`. Des demandes malveillantes pouvaient entraîner la divulgation de `fd`, ainsi que des erreurs `EMFILE` et une absence de réponse du serveur.
- 4.8.0
  - Les tableaux creux qui possèdent des index très élevés dans la chaîne de requête pouvaient entraîner la saturation de mémoire et la panne du serveur.
  - Les objets contenant des chaînes de requête extrêmement imbriquées pouvaient entraîner le blocage du processus et figer temporairement le serveur.

## 3.x

  <div class="doc-box doc-warn" markdown="1">
  **Express 3.x IS END-OF-LIFE AND NO LONGER MAINTAINED**

Known and unknown security and performance issues in 3.x have not been addressed since the last update (1 August, 2015). It is highly recommended to use the latest version of Express.

If you are unable to upgrade past 3.x, please consider [Commercial Support Options](/{{ page.lang }}/support#commercial-support-options).

  </div>

- 3.19.1
  - Correction de la vulnérabilité de divulgation de racine dans `express.static`, `res.sendfile` et `res.sendFile`
- 3.19.0
  - Correction de la vulnérabilité de redirection ouverte dans `express.static` ([advisory](https://npmjs.com/advisories/35), [CVE-2015-1164](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-1164)).
- 3.16.10
  - Correction des vulnérabilités de traversée de répertoire dans `express.static`.
- 3.16.6
  - Node.js 0.10 peut divulguer des `fd` dans certaines situations qui affectent `express.static` et `res.sendfile`. Des demandes malveillantes pouvaient entraîner la divulgation de `fd`, ainsi que des erreurs `EMFILE` et une absence de réponse du serveur.
- 3.16.0
  - Les tableaux creux qui possèdent des index très élevés dans la chaîne de requête pouvaient entraîner la saturation de mémoire et la panne du serveur.
  - Les objets contenant des chaînes de requête extrêmement imbriquées pouvaient entraîner le blocage du processus et figer temporairement le serveur.
- 3.3.0
  - La réponse 404 à une tentative de substitution de méthode non prise en charge était susceptible d'entraîner des attaques de type cross-site scripting.
