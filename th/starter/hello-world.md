---
layout: page
title: Express "Hello World" example
description: Get started with Express.js by building a simple 'Hello World' application, demonstrating the basic setup and server creation for beginners.
menu: starter
lang: th
redirect_from: /starter/hello-world.html
---

# ตัวอย่าง Hello world

<div class="doc-box doc-info" markdown="1">
Embedded below is essentially the simplest Express app you can create. 
โค้ดด้านล่างนี้เป็นแอปพลิเคชัน Express จำเป็นแบบง่ายที่สุดที่คุณสามารถสร้างขึ้นได้ โดยเป็นไฟล์ app ไฟล์เดียว &mdash; _ไม่ใช้_ โค้ดที่ได้จาก [Express generator](/{{ page.lang }}/starter/generator.html) ที่สร้างโครงสร้างเริ่มต้นสำหรับแอปพลิเคชันตัวเต็มที่มีไฟล์ JavaScript มากมาย และไดเรทอรีย่อยสำหรับวัตถุประสงค์ต่างๆ

</div>

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

app นี้จะเริ่มต้นเซิร์ฟเวอร์และเฝ้าตรวจสอบ (listen) การเชื่อมต่อที่พอร์ต 3000 โดยที่ app จะตอบสนองด้วงคำว่า "Hello World!" The app responds with "Hello World!" for requests
to the root URL (`/`) or _route_. สำหรับการร้องขอ
มายัง root URL (`/`) หรือ _route_ แต่สำหรับ path อื่นๆ app จะตอบสนองด้วย **404 Not Found**

### Running Locally

เริ่มต้นด้วยการสร้างไดเรกทอรีชื่อว่า `myapp` เปลี่ยนไปที่ไดเรกทอรีที่สร้างขึ้นแล้วใสคำสั่ง `npm init` แล้วติดตั้ง `express` และ dependency ต่างๆ ดัง[ขั้นตอนการติดตั้ง](/{{ page.lang }}/starter/installing.html) Then, install `express` as a dependency, as per the [installation guide](/{{ page.lang }}/starter/installing.html).

ในไดเรกทอรี `myapp` สร้างไฟล์ `app.js` ขึ้นมาและคัดลอกโค้ดจากตัวอย่างข้างบนมากใส่ในไฟล์

<div class="doc-box doc-notice" markdown="1">
`req` (คำร้องขอ) และ `res` (คำตอบสนอง) เป็นอ็อบเจกต์เดียวกันที่จัดให้โดย Node ซึ่งคุณสมารถเรียกใช้ `req.pip()` `req.on('data', callback)` และอื่นๆ โดยไม่ต้องเรียกใช้ Express
</div>

รัน app ด้วยคำสั่งนี้:

```bash
$ node app.js
```

แล้วโหลด `http://localhost:3000/` ในเว็บเบราว์เซอร์เพื่อดูผลลัพธ์

### [Previous: Installing ](/{{ page.lang }}/starter/installing.html)&nbsp;&nbsp;&nbsp;&nbsp;[Next: Express Generator ](/{{ page.lang }}/starter/generator.html)
