---
layout: page
title: 在正式作業中使用 Express 的效能最佳作法
description: Discover performance and reliability best practices for Express apps in production, covering code optimizations and environment setups for optimal performance.
menu: advanced
lang: zh-tw
redirect_from: /advanced/best-practice-performance.html
---

# 正式作業最佳作法：效能和可靠性

## 概觀

本文討論部署至正式作業之 Express 應用程式的效能與可靠性最佳作法。

This topic clearly falls into the "devops" world, spanning both traditional development and operations. Accordingly, the information is divided into two parts:

- Things to do in your code (the dev part):
  - 採用 gzip 壓縮
  - [Don't use synchronous functions](#dont-use-synchronous-functions)
  - [Do logging correctly](#do-logging-correctly)
  - [Handle exceptions properly](#handle-exceptions-properly)
- Things to do in your environment / setup (the ops part):
  - 將 NODE_ENV 設為 "production"
  - 確定您的應用程式自動重新啟動
  - [Run your app in a cluster](#run-your-app-in-a-cluster)
  - [Cache request results](#cache-request-results)
  - 使用負載平衡器
  - 使用反向 Proxy

## Things to do in your code {#in-code}

以下是您可以在程式碼中執行的一些作法，藉以改良您應用程式的效能：

- Gzip 壓縮可以大幅減少回應內文的大小，從而提高 Web 應用程式的速度。請使用 [compression](https://www.npmjs.com/package/compression) 中介軟體，在您的 Express 應用程式中進行 gzip 壓縮。例如：
- [Don't use synchronous functions](#dont-use-synchronous-functions)
- [Do logging correctly](#do-logging-correctly)
- [Handle exceptions properly](#handle-exceptions-properly)

### 採用 gzip 壓縮

Gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app. Use the [compression](https://www.npmjs.com/package/compression) middleware for gzip compression in your Express app. For example:

```js
const compression = require('compression')
const express = require('express')
const app = express()
app.use(compression())
```

For a high-traffic website in production, the best way to put compression in place is to implement it at a reverse proxy level (see [Use a reverse proxy](#use-a-reverse-proxy)). In that case, you do not need to use compression middleware. 在正式作業中，如果網站的資料流量極高，落實執行壓縮最好的作法是在反向 Proxy 層次實作它（請參閱[使用反向 Proxy](#proxy)）。在該情況下，就不需使用壓縮中介軟體。如需在 Nginx 中啟用 gzip 壓縮的詳細資料，請參閱 Nginx 說明文件中的 [ngx_http_gzip_module 模組](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)。

### 不使用同步函數

Synchronous functions and methods tie up the executing process until they return. A single call to a synchronous function might return in a few microseconds or milliseconds, however in high-traffic websites, these calls add up and reduce the performance of the app. Avoid their use in production.

雖然 Node 和許多模組會提供其函數的同步與非同步版本，在正式作業中，請一律使用非同步版本。唯一有理由使用同步函數的時機是在最初啟動之時。 The only time when a synchronous function can be justified is upon initial startup.

如果您使用 Node.js 4.0+ 或 io.js 2.1.0+，每當您的應用程式使用同步 API 時，您可以使用 `--trace-sync-io` 指令行旗標，來列印警告和堆疊追蹤。當然，在正式作業中您其實不會想使用此旗標，但這可確保您的程式碼可準備用於正式作業中。如需相關資訊，請參閱 [io.js 2.1.0 每週更新](https://nodejs.org/en/blog/weekly-updates/weekly-update.2015-05-22/#2-1-0)。 Of course, you wouldn't want to use this in production, but rather to ensure that your code is ready for production. See the [node command-line options documentation](https://nodejs.org/api/cli.html#cli_trace_sync_io) for more information.

### Do logging correctly

In general, there are two reasons for logging from your app: For debugging and for logging app activity (essentially, everything else). Using `console.log()` or `console.error()` to print log messages to the terminal is common practice in development. But [these functions are synchronous](https://nodejs.org/api/console.html#console_console_1) when the destination is a terminal or a file, so they are not suitable for production, unless you pipe the output to another program.

#### For debugging

如果您為了除錯而記載，則不要使用 `console.log()`，請改用 [debug](https://www.npmjs.com/package/debug) 之類的特殊除錯模組。這個模組可讓您使用 DEBUG 環境變數，來控制哪些除錯訊息（若有的話）要送往 `console.err()`。為了讓應用程式完全維持非同步，您仍得將 `console.err()` 引導至另一個程式。但之後在正式作業中，實際上您並不會進行除錯，不是嗎？ This module enables you to use the DEBUG environment variable to control what debug messages are sent to `console.error()`, if any. To keep your app purely asynchronous, you'd still want to pipe `console.error()` to another program. But then, you're not really going to debug in production, are you?

#### 為了應用程式活動

如果您要記載應用程式活動（例如，追蹤資料流量或 API 呼叫），則不要使用 `console.log()`，請改用 [Winston](https://www.npmjs.com/package/winston) 或
[Bunyan](https://www.npmjs.com/package/bunyan) 之類的記載程式庫。如需這兩種程式庫的詳細比較，請參閱 StrongLoop 部落格文章 [Comparing Winston and Bunyan Node.js Logging](https://web.archive.org/web/20240000000000/https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/)。 For a detailed comparison of these two libraries, see the StrongLoop blog post [Comparing Winston and Bunyan Node.js Logging](https://web.archive.org/web/20240000000000/https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/).

### Handle exceptions properly

Node apps crash when they encounter an uncaught exception. Not handling exceptions and taking appropriate actions will make your Express app crash and go offline. If you follow the advice in [Ensure your app automatically restarts](#ensure-your-app-automatically-restarts) below, then your app will recover from a crash. Fortunately, Express apps typically have a short startup time. Nevertheless, you want to avoid crashing in the first place, and to do that, you need to handle exceptions properly.

為了確保您能處理所有的異常狀況，請使用下列技術：

- [使用 try-catch](#try-catch)
- [使用 promise](#promises)

Before diving into these topics, you should have a basic understanding of Node/Express error handling: using error-first callbacks, and propagating errors in middleware. Node uses an "error-first callback" convention for returning errors from asynchronous functions, where the first parameter to the callback function is the error object, followed by result data in succeeding parameters. To indicate no error, pass null as the first parameter. The callback function must correspondingly follow the error-first callback convention to meaningfully handle the error. And in Express, the best practice is to use the next() function to propagate errors through the middleware chain.

如需進一步瞭解錯誤處理的基本概念，請參閱：

- [Error Handling in Node.js](https://www.tritondatacenter.com/node-js/production/design/errors)
- [Building Robust Node Applications: Error Handling](https://web.archive.org/web/20240000000000/https://strongloop.com/strongblog/robust-node-applications-error-handling/) (StrongLoop blog)

#### What not to do

One thing you should _not_ do is to listen for the `uncaughtException` event, emitted when an exception bubbles all the way back to the event loop. Adding an event listener for `uncaughtException` will change the default behavior of the process that is encountering an exception; the process will continue to run despite the exception. This might sound like a good way of preventing your app from crashing, but continuing to run the app after an uncaught exception is a dangerous practice and is not recommended, because the state of the process becomes unreliable and unpredictable.

此外，使用 `uncaughtException` 被公認為[拙劣作法](https://nodejs.org/api/process.html#process_event_uncaughtexception)，這裡有一份[提案](https://github.com/nodejs/node-v0.x-archive/issues/2582)，指出如何將它從核心移除。因此，接聽 `uncaughtException` 並不可取。這是我們建議採取多重程序和監督程式等事項的原因：當機再重新啟動，通常是從錯誤回復最可靠的作法。 So listening for `uncaughtException` is just a bad idea. This is why we recommend things like multiple processes and supervisors: crashing and restarting is often the most reliable way to recover from an error.

我們也不建議使用 [domains](https://nodejs.org/api/domain.html)。它通常不能解決問題，並且是個已淘汰的模組。 It generally doesn't solve the problem and is a deprecated module.

#### 使用 try-catch

try-catch 是一種 JavaScript 語言建構，可用來捕捉同步程式碼中的異常狀況。例如，如以下所示，利用 try-catch 來處理 JSON 剖析錯誤。 Use try-catch, for example, to handle JSON parsing errors as shown below.

使用 [JSHint](http://jshint.com/) 或 [JSLint](http://www.jslint.com/) 之類的工具，有助您尋找隱含的異常狀況，例如[參照未定義變數中的錯誤](http://www.jshint.com/docs/options/#undef)。

Here is an example of using try-catch to handle a potential process-crashing exception.
This middleware function accepts a query field parameter named "params" that is a JSON object.

```js
app.get('/search', (req, res) => {
  // Simulating async operation
  setImmediate(() => {
    const jsonStr = req.query.params
    try {
      const jsonObj = JSON.parse(jsonStr)
      res.send('Success')
    } catch (e) {
      res.status(400).send('Invalid JSON string')
    }
  })
})
```

However, try-catch works only for synchronous code. 不過，try-catch 只適用於同步程式碼。由於 Node 平台主要是非同步（尤其是在正式作業環境），try-catch 不會捕捉大量的異常狀況。

#### 使用 promise

Promises will handle any exceptions (both explicit and implicit) in asynchronous code blocks that use `then()`. 只要非同步程式碼區塊使用 `then()`，promise 就會處理其中的任何異常狀況（包括明確和隱含）。只需在 promise 鏈尾端新增 `.catch(next)` 即可。例如： For example:

```js
app.get('/', (req, res, next) => {
  // do some sync stuff
  queryDb()
    .then((data) => makeCsv(data)) // handle data
    .then((csv) => { /* handle csv */ })
    .catch(next)
})

app.use((err, req, res, next) => {
  // handle error
})
```

現在，所有非同步與同步錯誤都會傳播到錯誤中介軟體。

However, there are two caveats:

1. All your asynchronous code must return promises (except emitters). If a particular library does not return promises, convert the base object by using a helper function like [Bluebird.promisifyAll()](http://bluebirdjs.com/docs/api/promise.promisifyall.html).
2. Event emitters (like `streams`) can still cause uncaught exceptions. So make sure you are handling the error event properly; for example:

```js
const wrap = fn => (...args) => fn(...args).catch(args[2])

app.get('/', wrap(async (req, res, next) => {
  const company = await getCompanyById(req.query.id)
  const stream = getLogoStreamById(company.id)
  stream.on('error', next).pipe(res)
}))
```

The `wrap()` function is a wrapper that catches rejected promises and calls `next()` with the error as the first argument.
[Asynchronous Error Handling in Express with Promises, Generators and ES7](https://web.archive.org/web/20240000000000/https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/)

[Promises in Node.js with Q – An Alternative to Callbacks](https://web.archive.org/web/20240000000000/https://strongloop.com/strongblog/promises-in-node-js-with-q-an-alternative-to-callbacks/)

## 在環境 / 設定中的作法

以下是您可以在系統環境中執行的一些作法，藉以改良您應用程式的效能：

- NODE_ENV 環境變數用來指定應用程式的執行環境（通常是開發或正式作業）。若要改良效能，其中一個最簡單的作法是將 NODE_ENV 設為 "production"。
- 在應用程式當機時（不論任何原因），自動重新啟動。
- [Run your app in a cluster](#run-your-app-in-a-cluster)
- [Cache request results](#cache-request-results)
- 負載平衡器通常是一個反向 Proxy，負責協調與多個應用程式實例和伺服器之間的資料流量。利用 [Nginx](http://nginx.org/en/docs/http/load_balancing.html) 或 [HAProxy](https://www.digitalocean.com/community/tutorials/an-introduction-to-haproxy-and-load-balancing-concepts)，就能輕鬆設定您應用程式的負載平衡器。
- 反向 Proxy 位於 Web 應用程式前面，除了將要求引導至應用程式，也會對要求執行支援的作業。除此之外，它還可以處理錯誤頁面、壓縮、快取、提供的檔案，以及負載平衡。

### 將 NODE_ENV 設為 "production"

The NODE_ENV environment variable specifies the environment in which an application is running (usually, development or production). One of the simplest things you can do to improve performance is to set NODE_ENV to "production."

將 NODE_ENV 設為 "production"，可讓 Express：

- Cache view templates.
- 快取從 CSS 延伸項目產生的 CSS 檔案。
- Generate less verbose error messages.

[測試指出](http://apmblog.dynatrace.com/2015/07/22/the-drastic-effects-of-omitting-node_env-in-your-express-js-applications/)單單這樣做，就能提高 3 倍的應用程式效能！

如果您需要撰寫環境特定的程式碼，您可以使用 `process.env.NODE_ENV` 來檢查 NODE_ENV 的值。請注意，檢查任何環境變數的值都會影響效能，因此請慎行。 Be aware that checking the value of any environment variable incurs a performance penalty, and so should be done sparingly.

In development, you typically set environment variables in your interactive shell, for example by using `export` or your `.bash_profile` file. But in general, you shouldn't do that on a production server; instead, use your OS's init system (systemd or Upstart). The next section provides more details about using your init system in general, but setting `NODE_ENV` is so important for performance (and easy to do), that it's highlighted here.

採用 Upstart 時，請在您的工作檔中使用 `env` 關鍵字。例如： For example:

```sh
# /etc/init/env.conf
 env NODE_ENV=production
```

如需相關資訊，請參閱 [Upstart Intro, Cookbook and Best Practices](http://upstart.ubuntu.com/cookbook/#environment-variables)。

採用 systemd 時，請在單位檔案中使用 `Environment` 指引。例如： For example:

```sh
# /etc/systemd/system/myservice.service
Environment=NODE_ENV=production
```

如需相關資訊，請參閱 [Using Environment Variables In systemd Units](https://coreos.com/os/docs/latest/using-environment-variables-in-systemd-units.html)。

### 確定您的應用程式自動重新啟動

In production, you don't want your application to be offline, ever. This means you need to make sure it restarts both if the app crashes and if the server itself crashes. Although you hope that neither of those events occurs, realistically you must account for both eventualities by:

- 當應用程式（和 Node）當機時，使用程序管理程式重新啟動它。
- Using the init system provided by your OS to restart the process manager when the OS crashes. It's also possible to use the init system without a process manager.

Node applications crash if they encounter an uncaught exception. The foremost thing you need to do is to ensure your app is well-tested and handles all exceptions (see [handle exceptions properly](#handle-exceptions-properly) for details). But as a fail-safe, put a mechanism in place to ensure that if and when your app crashes, it will automatically restart.

#### 使用程序管理程式

在開發中，只需從指令行使用 `node server.js` 或類似指令，就會啟動應用程式。但在正式作業中這樣做，卻會成為禍因。如果應用程式當機，就會離線直到您重新啟動它為止。為了確保應用程式會在當機時重新啟動，請使用程序管理程式。程序管理程式是一個應用程式的「儲存器」，有助於部署、提供高可用性，並可讓您在執行時期管理應用程式。 But doing this in production is a recipe for disaster. If the app crashes, it will be offline until you restart it. To ensure your app restarts if it crashes, use a process manager. A process manager is a "container" for applications that facilitates deployment, provides high availability, and enables you to manage the application at runtime.

除了在應用程式當機時重新啟動它，程序管理程式還可讓您：

- 洞察執行時期效能和資源的耗用情況。
- 動態修改設定，以改良效能。
- 控制叢集作業（StrongLoop PM 和 pm2）。

最普及的 Node 程序管理程式如下：

- [StrongLoop Process Manager](http://strong-pm.io/)
- [PM2](https://github.com/Unitech/pm2)
- [Forever](https://www.npmjs.com/package/forever)

有關這三種程序管理程式的特性比較，請參閱 [http://strong-pm.io/compare/](http://strong-pm.io/compare/)。

Using any of these process managers will suffice to keep your application up, even if it does crash from time to time.

However, StrongLoop PM has lots of features that specifically target production deployment. You can use it and the related StrongLoop tools to:

- 在本端建置和包裝您的應用程式，然後安全地部署到正式作業系統。
- Automatically restart your app if it crashes for any reason.
- Manage your clusters remotely.
- 檢視 CPU 設定檔和資料堆 Snapshot，使效能達到最佳，並診斷記憶體洩漏情況。
- 檢視您應用程式的效能度量。
- 藉由 Nginx 負載平衡器的整合控制，輕鬆調整至多部主機。

如同以下說明，當您使用 init 系統將 StrongLoop PM 安裝成作業系統服務時，它會自動隨系統一起重新啟動。因此，它會讓您的應用程式程序和叢集永遠維持作用中。 Thus, it will keep your application processes and clusters alive forever.

#### 使用 init 系統

The next layer of reliability is to ensure that your app restarts when the server restarts. Systems can still go down for a variety of reasons. To ensure that your app restarts if the server crashes, use the init system built into your OS. The two main init systems in use today are [systemd](https://wiki.debian.org/systemd) and [Upstart](http://upstart.ubuntu.com/).

init 系統若要與 Express 應用程式搭配使用，其作法有二：

- Run your app in a process manager, and install the process manager as a service with the init system. The process manager will restart your app when the app crashes, and the init system will restart the process manager when the OS restarts. This is the recommended approach.
- Run your app (and Node) directly with the init system. This is somewhat simpler, but you don't get the additional advantages of using a process manager.

##### Systemd

Systemd 是一個 Linux 系統和服務管理程式。大部分主要的 Linux 發行套件已採用 systemd 作為其預設 init 系統。 Most major Linux distributions have adopted systemd as their default init system.

A systemd service configuration file is called a _unit file_, with a filename ending in `.service`. Here's an example unit file to manage a Node app directly. Replace the values enclosed in `<angle brackets>` for your system and app:

```sh
[Unit]
Description=Awesome Express App

[Service]
Type=simple
ExecStart=/usr/local/bin/node /projects/myapp/index.js
WorkingDirectory=/projects/myapp

User=nobody
Group=nogroup

# Environment variables:
Environment=NODE_ENV=production

# Allow many incoming connections
LimitNOFILE=infinity

# Allow core dumps for debugging
LimitCORE=infinity

StandardInput=null
StandardOutput=syslog
StandardError=syslog
Restart=always

[Install]
WantedBy=multi-user.target
```

如需 systemd 的相關資訊，請參閱 [systemd 參照（線上指令說明）](http://www.freedesktop.org/software/systemd/man/systemd.unit.html)。

##### 將 StrongLoop PM 當成 systemd 服務

將 StrongLoop Process Manager 安裝成 systemd 服務很簡單。完成之後，當伺服器重新啟動時，就會自動重新啟動 StrongLoop PM，之後它就會重新啟動其所管理的所有應用程式。 After you do, when the server restarts, it will automatically restart StrongLoop PM, which will then restart all the apps it is managing.

將 StrongLoop PM 安裝成 systemd 服務：

```bash
$ sudo sl-pm-install --systemd
```

然後使用下列指令來啟動服務：

```bash
$ sudo /usr/bin/systemctl start strong-pm
```

如需相關資訊，請參閱 [Setting up a production host（StrongLoop 說明文件）](https://docs.strongloop.com/display/SLC/Setting+up+a+production+host#Settingupaproductionhost-RHEL7+,Ubuntu15.04or15.10)。

##### Upstart

Upstart is a system tool available on many Linux distributions for starting tasks and services during system startup, stopping them during shutdown, and supervising them. You can configure your Express app or process manager as a service and then Upstart will automatically restart it when it crashes.

Upstart 服務定義在工作配置檔（亦稱為 "job"）中，其副名結尾是 `.conf`。下列範例顯示如何為名稱是 "myapp" 的應用程式，建立一項名稱是 "myapp" 的工作，且其主要檔案位於 `/projects/myapp/index.js`。 The following example shows how to create a job called "myapp" for an app named "myapp" with the main file located at `/projects/myapp/index.js`.

在 `/etc/init/` 建立名稱是 `myapp.conf` 的檔案，且其內容如下（請以您系統和應用程式的值取代粗體字）：

```sh
# When to start the process
start on runlevel [2345]

# When to stop the process
stop on runlevel [016]

# Increase file descriptor limit to be able to handle more requests
limit nofile 50000 50000

# Use production mode
env NODE_ENV=production

# Run as www-data
setuid www-data
setgid www-data

# Run from inside the app dir
chdir /projects/myapp

# The process to start
exec /usr/local/bin/node /projects/myapp/index.js

# Restart the process if it is down
respawn

# Limit restart attempt to 10 times within 10 seconds
respawn limit 10 10
```

附註：這個 Script 需要 Upstart 1.4 或更新版本，且 Ubuntu 12.04-14.10 支援該 Upstart 版本。 %}

Since the job is configured to run when the system starts, your app will be started along with the operating system, and automatically restarted if the app crashes or the system goes down.

除了自動重新啟動應用程式，Upstart 可讓您使用下列指令：

- `start myapp` – 啟動應用程式
- `restart myapp` – 重新啟動應用程式
- `stop myapp` – 停止應用程式。

如需 Upstart 的相關資訊，請參閱 [Upstart Intro, Cookbook and Best Practises](http://upstart.ubuntu.com/cookbook)。

##### 將 StrongLoop PM 當成 Upstart 服務

將 StrongLoop Process Manager 安裝成 Upstart 服務很簡單。完成之後，當伺服器重新啟動時，就會自動重新啟動 StrongLoop PM，之後它就會重新啟動其所管理的所有應用程式。 After you do, when the server restarts, it will automatically restart StrongLoop PM, which will then restart all the apps it is managing.

將 StrongLoop PM 安裝成 Upstart 1.4 服務：

```bash
$ sudo sl-pm-install
```

然後使用下列指令來執行服務：

```bash
$ sudo /sbin/initctl start strong-pm
```

{% include admonitions/note.html content="On systems that don't support Upstart 1.4, the commands are slightly different. 附註：在不支援 Upstart 1.4 的系統上，指令略有不同。如需相關資訊，請參閱 [Setting up a production host（StrongLoop 說明文件）](https://docs.strongloop.com/display/SLC/Setting+up+a+production+host#Settingupaproductionhost-RHELLinux5and6,Ubuntu10.04-.10,11.04-.10)。 %}

### Run your app in a cluster

In a multi-core system, you can increase the performance of a Node app by many times by launching a cluster of processes. A cluster runs multiple instances of the app, ideally one instance on each CPU core, thereby distributing the load and tasks among the instances.

![Balancing between application instances using the cluster API](/images/clustering.png)

IMPORTANT: Since the app instances run as separate processes, they do not share the same memory space. That is, objects are local to each instance of the app. Therefore, you cannot maintain state in the application code. However, you can use an in-memory datastore like [Redis](http://redis.io/) to store session-related data and state. This caveat applies to essentially all forms of horizontal scaling, whether clustering with multiple processes or multiple physical servers.

In clustered apps, worker processes can crash individually without affecting the rest of the processes. Apart from performance advantages, failure isolation is another reason to run a cluster of app processes. Whenever a worker process crashes, always make sure to log the event and spawn a new process using cluster.fork().

#### 使用 Node 的叢集模組

Clustering is made possible with Node's [cluster module](https://nodejs.org/dist/latest-v4.x/docs/api/cluster.html). This enables a master process to spawn worker processes and distribute incoming connections among the workers. 利用 Node 的[叢集模組](https://nodejs.org/docs/latest/api/cluster.html)，即可達成叢集作業。這可讓主要程序衍生工作者程序，並將送入的連線分散在這些工作者之間。不過，與其直接使用這個模組，更好的作法是使用其中提供的一個工具，自動為您執行叢集作業；
例如 [node-pm](https://www.npmjs.com/package/node-pm) 或 [cluster-service](https://www.npmjs.com/package/cluster-service)。

#### 使用 StrongLoop PM

如果您將應用程式部署至 StrongLoop Process Manager (PM)，您可以善用叢集作業，且_不需_修改應用程式碼。

當 StrongLoop Process Manager (PM) 執行應用程式時，它會自動在叢集中執行它，且該叢集中的工作者數目等於系統上的 CPU 核心數。您可以使用 slc 指令行工具，直接手動變更工作者程序數目，而不需停止應用程式。 You can manually change the number of worker processes in the cluster using the slc command line tool without stopping the app.

舉例來說，假設您將應用程式部署至 prod.foo.com，且 StrongLoop PM 是在埠 8701（預設值）接聽，請使用 slc 將叢集大小設為 8：

```bash
$ slc ctl -C http://prod.foo.com:8701 set-size my-app 8
```

如需利用 StrongLoop PM 執行叢集作業的相關資訊，請參閱 StrongLoop 說明文件中的[叢集作業](https://docs.strongloop.com/display/SLC/Clustering)。

#### Using PM2

If you deploy your application with PM2, then you can take advantage of clustering _without_ modifying your application code.  You should ensure your [application is stateless](http://pm2.keymetrics.io/docs/usage/specifics/#stateless-apps) first, meaning no local data is stored in the process (such as sessions, websocket connections and the like).

When running an application with PM2, you can enable **cluster mode** to run it in a cluster with a number of instances of your choosing, such as the matching the number of available CPUs on the machine. You can manually change the number of processes in the cluster using the `pm2` command line tool without stopping the app.

To enable cluster mode, start your application like so:

```bash
# Start 4 worker processes
$ pm2 start npm --name my-app -i 4 -- start
# Auto-detect number of available CPUs and start that many worker processes
$ pm2 start npm --name my-app -i max -- start
```

This can also be configured within a PM2 process file (`ecosystem.config.js` or similar) by setting `exec_mode` to `cluster` and `instances` to the number of workers to start.

Once running, the application can be scaled like so:

```bash
# Add 3 more workers
$ pm2 scale my-app +3
# Scale to a specific number of workers
$ pm2 scale my-app 2
```

For more information on clustering with PM2, see [Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/) in the PM2 documentation.

### 快取要求結果

在正式作業中改良效能的另一項策略是快取要求的結果，這樣您的應用程式就不會重複執行作業而反覆處理相同的要求。

使用 [Varnish](https://www.varnish-cache.org/) 或 [Nginx](https://www.nginx.com/resources/wiki/start/topics/examples/reverseproxycachingexample/)（另請參閱 [Nginx 快取](https://serversforhackers.com/nginx-caching/)）等之類的快取伺服器，可大幅改良您應用程式的速度與效能。

### 使用負載平衡器

No matter how optimized an app is, a single instance can handle only a limited amount of load and traffic. One way to scale an app is to run multiple instances of it and distribute the traffic via a load balancer. Setting up a load balancer can improve your app's performance and speed, and enable it to scale more than is possible with a single instance.

A load balancer is usually a reverse proxy that orchestrates traffic to and from multiple application instances and servers. You can easily set up a load balancer for your app by using [Nginx](http://nginx.org/en/docs/http/load_balancing.html) or [HAProxy](https://www.digitalocean.com/community/tutorials/an-introduction-to-haproxy-and-load-balancing-concepts).

With load balancing, you might have to ensure that requests that are associated with a particular session ID connect to the process that originated them. This is known as _session affinity_, or _sticky sessions_, and may be addressed by the suggestion above to use a data store such as Redis for session data (depending on your application). For a discussion, see [Using multiple nodes](https://socket.io/docs/v4/using-multiple-nodes/).

### 使用反向 Proxy

A reverse proxy sits in front of a web app and performs supporting operations on the requests, apart from directing requests to the app. It can handle error pages, compression, caching, serving files, and load balancing among other things.

Handing over tasks that do not require knowledge of application state to a reverse proxy frees up Express to perform specialized application tasks. For this reason, it is recommended to run Express behind a reverse proxy like [Nginx](https://www.nginx.com/) or [HAProxy](http://www.haproxy.org/) in production.
