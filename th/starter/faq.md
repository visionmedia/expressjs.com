---
layout: page
title: Express FAQ
description: Find answers to frequently asked questions about Express.js, including topics on application structure, models, authentication, template engines, error handling, and more.
menu: starter
lang: th
redirect_from: /starter/faq.html
---

# คำถามที่พบบ่อย

## โครงสร้างแอปพลิเคชันของผมควรจะเป็นอย่าไร?

There is no definitive answer to this question. The answer depends
on the scale of your application and the team that is involved. To be as
flexible as possible, Express makes no assumptions in terms of structure.

เส้นทางและตรรกะเฉพาะแอปพลิเคชัน (application-specific) อื่นๆ สามารถทำงานในหลากหลายไฟล์ที่คุณต้องการ
ในหลายๆ ไดเรกเทอรีที่คุณต้องการ สามารถดูตัวอย่างด้านล่างนี้เพื่อเป็นแนวทาง: View the following
examples for inspiration:

- [Route listings](https://github.com/expressjs/express/blob/4.13.1/examples/route-separation/index.js#L32-47)
- [Route map](https://github.com/expressjs/express/blob/4.13.1/examples/route-map/index.js#L52-L66)
- [MVC style controllers](https://github.com/expressjs/express/tree/master/examples/mvc)

ยังมีแหล่งตัวอย่างอื่นๆ สำหรับ Express ซึ่งทำให้ง่ายโดยใช้รูปแบบ:

- [Resourceful routing](https://github.com/expressjs/express-resource)

## How do I define models?

Express has no notion of a database. Express ไม่มีความคิดของฐานข้อมูล แนวคิดนี้อยู่ในโมดูลอื่นของ Node ที่จะทำให้คุณติดต่อกับหลากหลายฐานข้อมูล

ดู [LoopBack](http://loopback.io) for an Express-based framework that is centered around models.

## จะพิสูจน์ตัวตนของผู้ใช้งานได้อย่างไร?

Authentication is another opinionated area that Express does not
venture into. You may use any authentication scheme you wish.
การพิสูจน์ตัวตนของผู้ใช้งานเป็นอีกส่วนหนี่งที่ Express ไม่ได้เข้าร่วม คุณอาจใช้รูปแบบพิสูจน์ตัวตนของผู้ใช้งานที่คุณต้องการ
สำหรับตัวอย่างที่ง่ายที่สุดคือรูปแบบ username / password, ดู [ตัวอย่างนี้](https://github.com/expressjs/express/tree/master/examples/auth)

## template engines ไหนบ้างที่ Express รองรับ?

Express รองรับทุก template engine ที่สอดคล้องกับ `(path, locals, callback)`
เพื่อสร้างอินเทอร์เฟสสำหรับ template engine และการเคช ดูที่ [consolidate.js](https://github.com/visionmedia/consolidate.js)
โครงการที่รองรับ ที่ไม่อยู่ในรายการ template engines อาจยังคงรองรับโดย Express
To normalize template engine interfaces and caching, see the
[consolidate.js](https://github.com/visionmedia/consolidate.js)
project for support. Unlisted template engines might still support the Express signature.

สำหรับข้อมูลเพิ่มเติม, ดูที่ [การใช้ template engine กับ Express](/{{page.lang}}/guide/using-template-engines.html)

## จะจัดการกับการตอบสนอง 404 ได้อย่างไร?

In Express, 404 responses are not the result of an error, so
the error-handler middleware will not capture them. ใน Express, การตอบสนอง 404 ไม่ใช้ผลของความผิดพลาด ดังนั้น
มิดเดิลแวร์ที่จัดการกับความผิดพลาด (error-handler) จะไม่ตรวจจับมัน พฤติกรรมเป็นแบบนี้
เพราะว่าการตอบสนอง 404 เป็นการบ่งชี้ว่ามีสิ่งผิดปรกติเกิดขึ้นอาจจะต้อมีสิ่งเพิ่มเติมมาจัดการ
ในงานอื่นๆ Express จะดำเนินการฟังก์ชันมิดเดิลแวร์และเส้นทางทั้งหมด และพบว่าไม่มีอะไรที่จะตอบสนอง
สิ่งที่คุณต้องทำคือเพิ่มฟังก์ชันมิดเดิลแวร์ที่ด้านล่างสุดเพื่อจัดการกับการตอบสนอง 404: All you need to
do is add a middleware function at the very bottom of the stack (below all other functions)
to handle a 404 response:

```js
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})
```

Add routes dynamically at runtime on an instance of `express.Router()`
so the routes are not superseded by a middleware function.

## จะตั้งค่าจัดการความผิดพลาดได้อย่างไร?

กำหนดมิดเดิลแวร์จัดการความผิดพลาด (error-handler) เช่นเดียวกับมิดเดิลแวร์อื่น ยกเว้นอาร์กิวเมนต์ 4 ตัวแทนที่จะเป็น 3 ตัว
ดังนี้ `(err, req, res, next)`

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

สำหรับข้อมูลเพิ่มเติม, ดูที่ [Error handling](/{{ page.lang }}/guide/error-handling.html).

## จะสร้าง HTML ธรรมดาได้อย่างไร?

คุณไม่ต้อง! There's no need to "render" HTML with the `res.render()` function.
If you have a specific file, use the `res.sendFile()` function.
ไม่จำเป็นต้องสร้าง HTML ด้วยฟังก์ชัน `res.render()`
ถ้าคุณมีไฟล์เฉพาะ ใช้ฟังก์ชัน `res.sendFile()` ถ้าคุณต้องการบริการหลายสินทรัพย์จากไดเรกเทอรี ใช้ฟังก์ชันมิดเดิลแวร์ `express.static()`

## What version of Node.js does Express require?

- [Express 4.x](/{{ page.lang }}/4x/api.html) requires Node.js 0.10 or higher.
- [Express 5.x](/{{ page.lang }}/5x/api.html) requires Node.js 18 or higher.

### [Previous: More examples ](/{{ page.lang }}/starter/examples.html)
