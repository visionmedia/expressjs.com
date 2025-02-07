---
layout: page
title: Installazione di Express
description: Learn how to install Express.js in your Node.js environment, including setting up your project directory and managing dependencies with npm.
menu: starter
lang: it
redirect_from: /starter/installing.html
---

# Installazione

Presumendo che sia stato già installato [Node.js](https://nodejs.org/), creare una directory in cui conservare l'applicazione e renderla la directory di lavoro.

- [Express 4.x](/{{ page.lang }}/4x/api.html) requires Node.js 0.10 or higher.
- [Express 5.x](/{{ page.lang }}/5x/api.html) requires Node.js 18 or higher.

```bash
$ mkdir myapp
$ cd myapp
```

Utilizzare il comando `npm init` per creare un file `package.json` per l'applicazione.
Per ulteriori informazioni sul funzionamento di `package.json`, consultare [Informazioni specifiche sulla gestione di package.json di npm](https://docs.npmjs.com/files/package.json).

```bash
$ npm init
```

Questo comando richiede di specificare alcune informazioni, ad esempio il nome e la versione dell'applicazione.
Per il momento, è possibile semplicemente premere il tasto INVIO per accettare i valori di default per molti di esse, ad eccezione di quanto segue:

```
entry point: (index.js)
```

Immettere `app.js` o qualsiasi altra cosa come nome del file principale. Se si desidera che sia `index.js`, premere il tasto INVIO per accettare il nome file predefinito consigliato.

Quindi installare Express nella directory `myapp` e salvarlo nell'elenco delle dipendenze. Ad esempio:

```bash
$ npm install express
```

Per installare momentaneamente Express e non aggiungerlo all'elenco di dipendenze, omettere l'opzione `--save`:

```bash
$ npm install express --save
```

<div class="doc-box doc-info" markdown="1">
I moduli Node installati con l'opzione `--save` vengono aggiunti all'elenco `dependencies` nel file `package.json`. Successivamente, l'esecuzione di `npm install` nella directory `app` installerà automaticamente i moduli nell'elenco di dipendenze.
</div>

### [Next: Hello World ](/{{ page.lang }}/starter/hello-world.html)
