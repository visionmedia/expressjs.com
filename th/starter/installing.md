---
layout: page
title: Installing Express
description: Learn how to install Express.js in your Node.js environment, including setting up your project directory and managing dependencies with npm.
menu: starter
lang: th
redirect_from: /starter/installing.html
---

# การติดตั้ง

สมมุติว่าคุณได้ติดตั้ง [Node.js](https://nodejs.org/) ในเครื่องคุณเรียบร้อยแล้ว ใช้คำสั่งข้างล่างนี้เพื่อสร้างไดเรกทอรีสำหรับเก็บแอปพลิเคชันของคุณ และใช้เป็นเก็บไฟล์ที่จะสร้างขึ้นต่อไป

- [Express 4.x](/{{ page.lang }}/4x/api.html) requires Node.js 0.10 or higher.
- [Express 5.x](/{{ page.lang }}/5x/api.html) requires Node.js 18 or higher.

```bash
$ mkdir myapp
$ cd myapp
```

ใช้คำสั่ง `npm init` เพื่อสร้างไฟล์ `package.json` สำหรับแอปพลิเคชันของคุณ
สำหรับข้อมูลเพิ่มเติมว่า `package.json` ทำงานอย่างไร สำมารถดูได้ที่ [Specifics of npm's package.json handling](https://docs.npmjs.com/files/package.json)

```bash
$ npm init
```

This command prompts you for a number of things, such as the name and version of your application.
For now, you can simply hit RETURN to accept the defaults for most of them, with the following exception:

```
entry point: (index.js)
```

ใส่ `app.js` หรือชื่ออะไรก็ตามที่คุณต้องการสำหรับไฟล์หลักที่จะสร้าง ถ้าคุณต้องการใช้ค่าเริ่มต้นเป็น `index.js` เพียงกดปุ่ม ENTER เพื่อรับค่าเริ่มต้นของไฟล์หลักที่แนะนำ If you want it to be `index.js`, hit RETURN to accept the suggested default file name.

ต่อไปเป็นการติดตั้ง Express ในไดเรกเทอรี `myapp` และบันทึกไว้ในรายการเกี่ยวโยง (dependencies list) ตัวอย่างเช่น: For example:

```bash
$ npm install express
```

สามารถติดตั้ง Express ชั่วคราวได้โดยไม่ใส่ไว้ในรายการเกี่ยวโยง ด้วยคำสั่ง:

```bash
$ npm install express --no-save
```

<div class="doc-box doc-info" markdown="1">

โดยค่าเริ่มต้นของ npm รุ่นที่ 5.0 ขึ้นไป คำสั่ง `npm install` เพิ่มโมดูลต่างๆ ไปที่รายการ `dependencies` ในไฟล์ `package.json` ถ้าเป็นรุ่นแรกๆ ของ npm คุณจำเป็นต้องใส่คำสั่ง `--save` ไปพร้อมกับคำสั่ง `npm install` ซึ่อหลังจากนี้ใช้คำสั่ง `npm install` ในไดเรกเทอรีของคุณ จะติดตั้งโมดูลที่อยู่ในรายการ dependencies โดยอัตโนมัติ
 Then, afterwards, running `npm install` in the app directory will automatically install modules in the dependencies list.
</div>

### [Next: Hello World ](/{{ page.lang }}/starter/hello-world.html)
