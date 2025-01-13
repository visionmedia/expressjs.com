---
layout: middleware
title: Проміжні Express-модулі
description: Ознайомтесь із списком проміжних модулів Express.js, які підтримуються командою Express та спільнотою, й включають вбудовані модулі та популярні сторонні пакети.
menu: resources
lang: uk
redirect_from: "/resources/middleware.html"
module: mw-home
---

## Проміжні Express-модулі

Проміжні Express-модулі, перелічені тут, підтримуюються [командою Expressjs](https://github.com/orgs/expressjs/people).

| Проміжний модуль | Опис | Заміняє таку вбудовану функцію (Express 3) |
|---------------------------|---------------------|----------------------|
| [body-parser](/resources/middleware/body-parser.html) | Аналізує та перетворює в об'єкт тіло HTTP запиту. Також перегляньте: [body](https://github.com/raynos/body), [co-body](https://github.com/visionmedia/co-body), і [raw-body](https://github.com/stream-utils/raw-body). | express.bodyParser |
| [compression](/resources/middleware/compression.html) | Стискає HTTP відповіді. | express.compress |
| [connect-rid](/resources/middleware/connect-rid.html) | Генерує унікальний ідентифікатор запиту. | NA |
| [cookie-parser](/resources/middleware/cookie-parser.html) | Аналізує cookie-заголовок та поміщає його вміст у `req.cookies`. Також перегляньте [cookies](https://github.com/jed/cookies) і [keygrip](https://github.com/jed/keygrip). | express.cookieParser|
| [cookie-session](/resources/middleware/cookie-session.html) | Додає створення сесій на основі cookies.| express.cookieSession |
| [cors](/resources/middleware/cors.html) | Додає підтримку спільного доступу до ресурсів між різними джерелами (CORS) з можливістю конфігурації. | NA
| [errorhandler](/resources/middleware/errorhandler.html) | Додає обробку помилок та полегшує виправку багів під час розробки. | express.errorHandler |
| [method-override](/resources/middleware/method-override.html) | Замінює HTTP метод через заголовки. | express.methodOverride |
| [morgan](/resources/middleware/morgan.html) | Фіксує HTTP запити в логах. | express.logger |
| [multer](/resources/middleware/multer.html) | Обробляє запити з даними, які містять файли. | express.bodyParser |
| [response-time](/resources/middleware/response-time.html) | Фіксує тривалість обробки HTTP запиту. |express.responseTime |
| [serve-favicon](/resources/middleware/serve-favicon.html) | Додає іконку сайту. | express.favicon |
| [serve-index](/resources/middleware/serve-index.html) | Відображає список файлів у вказаній шляхом директорії. | express.directory |
| [serve-static](/resources/middleware/serve-static.html) | Додає підтримку передачі статичних файлів. | express.static |
| [session](/resources/middleware/session.html) | Додає серверні сесії (лише для розробки). | express.session |
| [timeout](/resources/middleware/timeout.html) | Встановлює обмеження часу обробки HTTP-запиту. | express.timeout |
| [vhost](/resources/middleware/vhost.html) | Створює віртуальні домени. | express.vhost |

## Додаткові проміжні модулі

Кілька інших популярних проміжних модулів.

{% include community-caveat.html %}

| Проміжний&nbsp;модуль | Опис |
|---------------------------|---------------------|
| [cls-rtracer](https://github.com/puzpuzpuz/cls-rtracer) | Проміжний модуль для генерації ідентифікаторів запитів на основі CLS. Готове рішення для додавання ідентифікаторів запитів у ваші логи. |
| [connect-image-optimus](https://github.com/msemenistyi/connect-image-optimus) | Оптимізує передачу зображень. Перетворює зображення в формат `.webp` або `.jxr`, якщо це можливо. |
| [error-handler-json](https://github.com/mifi/error-handler-json) | Обробник помилок для JSON API (форк з `api-error-handler`.)|
| [express-debug](https://github.com/devoidfury/express-debug) | Інструмент для розробки, який додає інформацію про шаблонні змінні (locals), поточну сесію та інше. |
| [express-partial-response](https://github.com/nemtsov/express-partial-response) | Фільтрує частини JSON-відповідей на основі параметра `fields`, використовуючи схожий до Google API підхід часткової відповіді. |
| [express-simple-cdn](https://github.com/jamiesteven/express-simple-cdn) | Додає CDN для статичних ресурсів із підтримкою кількох хостів. |
| [express-slash](https://github.com/ericf/express-slash) | Дає змогу обробляє маршрути з і без косої риски в кінці. |
| [express-uncapitalize](https://github.com/jamiesteven/express-uncapitalize) | Перенаправляє HTTP-запити, що містять великі літери, до канонічного шляху з малими літерами. |
| [helmet](https://github.com/helmetjs/helmet) | Допомагає забезпечити безпеку ваших додатків шляхом встановлення різних HTTP-заголовків. |
| [join-io](https://github.com/coderaiser/join-io) | Об'єднує файли на льоту для зменшення кількості запитів. |
| [passport](https://github.com/jaredhanson/passport) | Дозволяє автентифікацію за допомогою "стратегій", таких як OAuth, OpenID та багатьох інших. Перегляньте [http://passportjs.org/](http://passportjs.org/) для додаткової інформації. |
| [static-expiry](https://github.com/paulwalker/connect-static-expiry) | Додає унікальні URL-ідентифікатори та заголовки кешування для статичних ресурсів. |
| [view-helpers](https://github.com/madhums/node-view-helpers) | Поширені допоміжні функції для шаблонізації. |
| [sriracha-admin](https://github.com/hdngr/siracha) | Динамічно генерує адмін-панель для Mongoose. |

Щоби знайти більше проміжних модулів, перегляньте [http-framework](https://github.com/Raynos/http-framework#modules).