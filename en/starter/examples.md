---
layout: page
title: Express examples
description: Explore a collection of Express.js application examples covering various use cases, integrations, and advanced configurations to help you learn and build your projects.
menu: starter
lang: en
redirect_from: "/starter/examples.html"
---

{% capture examples %}{% include readmes/express-master/examples.md %}{% endcapture %}
{{ examples | replace: "](.", "](https://github.com/expressjs/express/tree/master/examples" }}

## Boilerplate

-   [Boilerplate](http://github.com/robrighter/node-boilerplate) -- boilerplate app supplying Express, Connect, Socket-IO, Jade/Pug and more.
-   [express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api) -- A boilerplate application for building REST APIs using express and mongoose in ES6 with code coverage.
-   [express-site-template](https://github.com/langpavel/node-express-site-template) -- jade, stylus, sessions with redis
-   [backbone-express-mongoose-socketio](https://github.com/datapimp/backbone-express-mongoose-socketio) -- Boilerplate app supplying backbone, mongoose, and socket.io
-   [node-express-mongoose](https://github.com/madhums/node-express-mongoose) -- A boilerplate application for building web apps using express, mongoose and passport. ([demo](http://nodejs-express-demo.herokuapp.com/))
-   [bearcat-todo](https://github.com/bearcatnode/todo) -- a simple todo app built on [bearcat](https://github.com/bearcatnode/bearcat) and express, bearcat makes it easy write simple, maintainable node.js
-   [node-scaffold](https://github.com/mauriciogior/node-scaffold) -- a beautiful scaffolding module. It generates an app (MVC) based on express and mongoose for a given json configuration.

## Additional examples

These are some additional examples with more extensive integrations.

{% include community-caveat.html %}

- [prisma-fullstack](https://github.com/prisma/prisma-examples/tree/latest/pulse/fullstack-simple-chat) - Fullstack app with Express and Next.js using [Prisma](https://www.npmjs.com/package/prisma) as an ORM
- [prisma-rest-api-ts](https://github.com/prisma/prisma-examples/tree/latest/orm/express) - REST API with Express in TypeScript using [Prisma](https://www.npmjs.com/package/prisma) as an ORM

### [Previous: Static Files ](/{{ page.lang }}/starter/static-files.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: FAQ ](/{{ page.lang }}/starter/faq.html)
