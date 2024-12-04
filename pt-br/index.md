---
layout: home
title: Express - framework de aplicativo da web Node.js
menu: home
lang: pt-br
---
<section id="home-content">
  {% include header/header-{{ page.lang }}.html %}
  <div id="overlay"></div>
  <div id="homepage-leftpane" class="pane">
    <section id="description">
         <div class="express"><a href="/">Express</a><a href="{{ page.lang }}/changelog/4x.html#{{ site.data.express.current_version }}" id="express-version">{{ site.data.express.current_version }}</a></div>
        <span class="description">Framework web rápido, flexível e minimalista para <a href='https://nodejs.org/en/'>Node.js</a></span>
    </section>
    <div id="install-command">$ npm install express --save</div>
  </div>
  
  <div id="homepage-rightpane" class="pane">
    <div id="quick-start">
      <h4>Exemplo Rápido</h4>
      <pre><code class="language-javascript">
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Olá Mundo!')
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})</code></pre>
    </div>
  </div>
</section>

<section id="announcements">
  {% include announcement/announcement-pt-br.md %}
</section>

<section id="intro">
  <div id="boxes" class="clearfix">
      <div id="web-applications" class="feature-box">
          <h3>Aplicativos da Web</h3>
          <p>O Express é um framework minimalista e flexível para Node.js que fornece um conjunto robusto de recursos para desenvolvimento de aplicações web modernas e APIs.</p>
          <a href="{{ page.lang }}/starter/basic-routing.html" class="learn-more">Saiba mais →</a>
      </div>

      <div id="apis" class="feature-box">
          <h3>APIs</h3>
          <p>Desenvolva APIs robustas e escaláveis com facilidade utilizando métodos HTTP intuitivos e um poderoso sistema de middleware para processamento de requisições.</p>
          <a href="{{ page.lang }}/guide/routing.html" class="learn-more">Saiba mais →</a>
      </div>

      <div id="performance" class="feature-box">
          <h3>Desempenho</h3>
          <p>Aproveite ao máximo o Node.js com uma camada leve de recursos fundamentais que não compromete a performance, mantendo sua aplicação rápida e eficiente.</p>
          <a href="{{ page.lang }}/advanced/best-practice-performance.html" class="learn-more">Saiba mais →</a>
      </div>

      <div id="middleware" class="feature-box">
          <h3>Middleware</h3>
          <p>Estenda as funcionalidades do Express através de middleware. Desde autenticação até compressão, existe um middleware para cada necessidade da sua aplicação.</p>
          <a href="{{ page.lang }}/guide/using-middleware.html" class="learn-more">Saiba mais →</a>
      </div>
  </div>
</section>
