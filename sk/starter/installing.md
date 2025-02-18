---
layout: page
title: Inštalácia Express
menu: starter
lang: sk
description: Learn how to install Express.js in your Node.js environment, including
  setting up your project directory and managing dependencies with npm.
---

# Inštalácia

Za predpokladu, že už máte nainštalovaný [Node.js](https://nodejs.org/), vytvorte priečinok pre vašu aplikáciu a presuňte sa tam.

```bash
$ mkdir myapp
$ cd myapp
```

Pomocou príkazu `npm init` vytvorte pre vašu aplikáciu súbor `package.json`.
Viac informácií o tom, ako funguje `package.json` sa dozviete po prečítaní [Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json).

```bash
$ npm init
```

Tento príkaz vás vyzve k zadaniu viacerých informácií, ako sú napr. názov a verzia vašej aplikácie.
Teraz, kvôli zjednodušeniu, stlačte len ENTER k potvrdeniu defaultných hodnôt väčšiny z nich, okrem bodu:

```bash
entry point: (index.js)
```

Zadajte `app.js`, prípadne akýkoľvek iný názov hlavného súboru vašej aplikácie. Ak ho chcete nazvať `index.js`, stlačte ENTER k potvrdeniu navrhovaného názvu súboru.

Teraz v `myapp` priečinku nainštalujte Express a pridajte ho ako dependenciu do package.json. Takto:

```bash
$ npm install express --save
```

Ak chcete nainštalovať Express bez toho, aby bol pridaný ako dependencia, vynechajte prepínač `--save`

```bash
$ npm install express
```

<div class="doc-box doc-info" markdown="1">
Node moduly inštalované s prepínačom `--save` sú automaticky pridané do `dependencies` zoznamu v súbore `package.json`.
Následne spustením príkazu `npm install` v `app` priečinku sa všetky dependencie zo zoznamu automaticky nainštalujú.
</div>
