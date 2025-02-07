---
layout: page
title: 実稼働環境における Express の使用におけるパフォーマンスに関するベスト・プラクティス
description: Discover performance and reliability best practices for Express apps in production, covering code optimizations and environment setups for optimal performance.
menu: advanced
lang: ja
redirect_from: /advanced/best-practice-performance.html
---

# 実稼働環境におけるベスト・プラクティス: パフォーマンスと信頼性

## 概説

この記事では、実稼働環境にデプロイされた Express アプリケーションのパフォーマンスと信頼性に関するベスト・プラクティスについて説明します。

This topic clearly falls into the "devops" world, spanning both traditional development and operations. Accordingly, the information is divided into two parts:

- コードで実行する処理 (開発部分)
  - [gzip 圧縮を使用する](#use-gzip-compression)
  - [同期関数を使用しない](#dont-use-synchronous-functions)
  - [ロギングを正確に実行する](#do-logging-correctly)
  - [例外を適切に処理する](#handle-exceptions-properly)
- 環境/セットアップで実行する処理 (運用部分)
  - [Set NODE_ENV to "production"](#set-node_env-to-production)
  - [Ensure your app automatically restarts](#ensure-your-app-automatically-restarts)
  - [Run your app in a cluster](#run-your-app-in-a-cluster)
  - [Cache request results](#cache-request-results)
  - [Use a load balancer](#use-a-load-balancer)
  - [Use a reverse proxy](#use-a-reverse-proxy)

## コードで実行する処理 {#in-code}

以下に、アプリケーションのパフォーマンスを向上させるためにコードで実行できる処理をいくつか挙げます。

- [gzip 圧縮を使用する](#use-gzip-compression)
- [同期関数を使用しない](#dont-use-synchronous-functions)
- [ロギングを正確に実行する](#do-logging-correctly)
- [例外を適切に処理する](#handle-exceptions-properly)

### gzip 圧縮を使用する

Gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app. Gzip 圧縮により、応答本体のサイズを大幅に縮小できるため、Web アプリケーションの速度が高くなります。Express アプリケーションで gzip 圧縮として [compression](https://www.npmjs.com/package/compression) ミドルウェアを使用してください。次に例を示します。 For example:

```js
const compression = require('compression')
const express = require('express')
const app = express()
app.use(compression())
```

For a high-traffic website in production, the best way to put compression in place is to implement it at a reverse proxy level (see [Use a reverse proxy](#use-a-reverse-proxy)). In that case, you do not need to use compression middleware. トラフィックが多い実稼働環境の Web サイトでは、圧縮を適用する最適な方法は、リバース・プロキシー・レベルで実装することです ([リバース・プロキシーの使用](#proxy)を参照)。その場合は、compression ミドルウェアを使用する必要はありません。Nginx で gzip 圧縮を有効にする方法について詳しくは、Nginx 資料の [Module ngx_http_gzip_module](http://nginx.org/en/docs/http/ngx_http_gzip_module.html) を参照してください。

### 同期関数を使用しない

同期の関数とメソッドは、返されるまで実行中のプロセスを結合します。同期関数に対する 1 回の呼び出しは数マイクロ秒から数ミリ秒で返される可能性がありますが、トラフィックが多い Web サイトでは、これらの呼び出しを合計すると、アプリケーションのパフォーマンスが低下します。実稼働環境では、これらを使用しないでください。 A single call to a synchronous function might return in a few microseconds or milliseconds, however in high-traffic websites, these calls add up and reduce the performance of the app. Avoid their use in production.

ノードおよび多くのモジュールは、同期版と非同期版の関数を提供していますが、実稼働環境では必ず非同期版を使用してください。同期関数を使用しても構わないのは、初期始動時のみです。 The only time when a synchronous function can be justified is upon initial startup.

Node.js 4.0+ または io.js 2.1.0+ を使用している場合、アプリケーションで同期 API を使用するときに、いつでも `--trace-sync-io` コマンド・ライン・フラグを使用して、警告とスタック・トレースを出力することができます。無論、この機能を実際に実稼働環境で使用することはありませんが、コードを実稼働環境で使用する準備ができていることを確認するために使用できます。詳細については、[io.js 2.1.0 の週次更新](https://nodejs.org/en/blog/weekly-updates/weekly-update.2015-05-22/#2-1-0)を参照してください。 Of course, you wouldn't want to use this in production, but rather to ensure that your code is ready for production. See the [node command-line options documentation](https://nodejs.org/api/cli.html#cli_trace_sync_io) for more information.

### ロギングを正確に実行する

In general, there are two reasons for logging from your app: For debugging and for logging app activity (essentially, everything else). Using `console.log()` or `console.error()` to print log messages to the terminal is common practice in development. But [these functions are synchronous](https://nodejs.org/api/console.html#console_console_1) when the destination is a terminal or a file, so they are not suitable for production, unless you pipe the output to another program.

#### For debugging

デバッグの目的でロギングを実行する場合は、`console.log()` を使用するのではなく、[debug](https://www.npmjs.com/package/debug) などの特殊なデバッグ・モジュールを使用します。このモジュールでは、DEBUG 環境変数を使用して、`console.err()` に送信されるデバッグ・メッセージを制御できます。アプリケーションを純粋に非同期的にしておくために、`console.err()` を別のプログラムにパイプ接続することもできます。しかし、実稼働環境ではデバッグを実行することはお勧めしません。 This module enables you to use the DEBUG environment variable to control what debug messages are sent to `console.error()`, if any. To keep your app purely asynchronous, you'd still want to pipe `console.error()` to another program. But then, you're not really going to debug in production, are you?

#### アプリケーション・アクティビティー

アプリケーション・アクティビティー (例えば、トラフィックまたは API 呼び出しのトラッキング) のロギングを実行する場合は、`console.log()` を使用するのではなく、[Winston](https://www.npmjs.com/package/winston) や [Bunyan](https://www.npmjs.com/package/bunyan) などのロギング・ライブラリーを使用します。これらの 2 つのライブラリーの詳細な比較については、StrongLoop ブログ投稿の [Comparing Winston and Bunyan Node.js Logging](https://web.archive.org/web/20240000000000/https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/) を参照してください。 For a detailed comparison of these two libraries, see the StrongLoop blog post [Comparing Winston and Bunyan Node.js Logging](https://web.archive.org/web/20240000000000/https://strongloop.com/strongblog/compare-node-js-logging-winston-bunyan/).

### 例外を適切に処理する

Node apps crash when they encounter an uncaught exception. Not handling exceptions and taking appropriate actions will make your Express app crash and go offline. [アプリケーションが確実に自動再始動するようにする](#ensure-your-app-automatically-restarts) Fortunately, Express apps typically have a short startup time. Nevertheless, you want to avoid crashing in the first place, and to do that, you need to handle exceptions properly.

確実にすべての例外を処理するには、以下の技法を使用します。

- [Try-catch の使用](#try-catch)
- [Promise の使用](#promises)

Before diving into these topics, you should have a basic understanding of Node/Express error handling: using error-first callbacks, and propagating errors in middleware. 上記のトピックを読む前に、error-first コールバックの使用と、ミドルウェアへのエラーの伝搬という Node/Express エラー処理の基礎を理解しておく必要があります。Node は、非同期関数からエラーを返すために「error-first コールバック」という規則を使用します。この場合、コールバック関数への最初のパラメーターがエラー・オブジェクトで、その後に続くパラメーターに結果データがあります。エラーがないことを示すには、最初のパラメーターとして `null` を渡します。コールバック関数は、エラーを有意に処理するには、error-first コールバック規則に対応して従う必要があります。Express におけるベスト・プラクティスは、next() 関数を使用して、ミドルウェア・チェーンを介してエラーを伝搬することです。 To indicate no error, pass null as the first parameter. The callback function must correspondingly follow the error-first callback convention to meaningfully handle the error. And in Express, the best practice is to use the next() function to propagate errors through the middleware chain.

エラー処理のその他の基礎については、下記を参照してください。

- [Error Handling in Node.js](https://www.tritondatacenter.com/node-js/production/design/errors)
- [Building Robust Node Applications: Error Handling](https://web.archive.org/web/20240000000000/https://strongloop.com/strongblog/robust-node-applications-error-handling/) (StrongLoop ブログ)

#### 実行してはならないこと

One thing you should _not_ do is to listen for the `uncaughtException` event, emitted when an exception bubbles all the way back to the event loop. Adding an event listener for `uncaughtException` will change the default behavior of the process that is encountering an exception; the process will continue to run despite the exception. This might sound like a good way of preventing your app from crashing, but continuing to run the app after an uncaught exception is a dangerous practice and is not recommended, because the state of the process becomes unreliable and unpredictable.

さらに、`uncaughtException` の使用は、正式に[粗雑なもの](https://nodejs.org/api/process.html#process_event_uncaughtexception)として認められており、これをコアから削除するための[提案](https://github.com/nodejs/node-v0.x-archive/issues/2582)が出されています。したがって、`uncaughtException` を listen するのは悪い方法です。この理由から複数のプロセスとスーパーバイザーなどの使用をお勧めしています。異常終了と再始動は、場合によってはエラーから復旧するための最も信頼できる方法となります。 So listening for `uncaughtException` is just a bad idea. This is why we recommend things like multiple processes and supervisors: crashing and restarting is often the most reliable way to recover from an error.

また、[domain](https://nodejs.org/api/domain.html) の使用もお勧めしません。このモジュールは概して問題を解決しないため、推奨されていません。 It generally doesn't solve the problem and is a deprecated module.

#### Try-catch の使用

Try-catch は、同期コードで例外をキャッチするために使用できる JavaScript 言語構造体です。Try-catch は、例えば、下記のように JSON 構文解析エラーを処理するために使用します。 Use try-catch, for example, to handle JSON parsing errors as shown below.

[JSHint](http://jshint.com/) または [JSLint](http://www.jslint.com/) などのツールを使用して、[未定義変数の参照エラー](http://www.jshint.com/docs/options/#undef)などの暗黙的な例外を検出します。

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

However, try-catch works only for synchronous code. ただし、Try-catch は同期コードでのみ機能します。Node プラットフォームは主に (特に実稼働環境で) 非同期的であるため、Try-catch は多くの例外をキャッチしません。

#### Promise の使用

Promise は、`then()` を使用する非同期コード・ブロックのすべての例外 (明示的と暗黙的の両方) を処理します。単に、Promise チェーンの最後に `.catch(next)` を追加してください。次に例を示します。 Just add `.catch(next)` to the end of promise chains. For example:

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

これで、非同期と同期のエラーがすべてエラー・ミドルウェアに伝搬されます。

However, there are two caveats:

1. All your asynchronous code must return promises (except emitters). すべての非同期コードが Promise を返す必要があります (エミッターを除く)。特定のライブラリーが Promise を返さない場合は、[Bluebird.promisifyAll()](http://bluebirdjs.com/docs/api/promise.promisifyall.html) などのヘルパー関数を使用して基本オブジェクトを変換します。
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

## 環境/セットアップで実行する処理

以下に、アプリケーションのパフォーマンスを向上させるためにシステム環境で実行できる処理をいくつか挙げます。

- [Set NODE_ENV to "production"](#set-node_env-to-production)
- [Ensure your app automatically restarts](#ensure-your-app-automatically-restarts)
- [Run your app in a cluster](#run-your-app-in-a-cluster)
- [Cache request results](#cache-request-results)
- [Use a load balancer](#use-a-load-balancer)
- [Use a reverse proxy](#use-a-reverse-proxy)

### NODE_ENV を「production」に設定する

NODE_ENV 環境変数は、アプリケーションが実行される環境 (通常は開発または実稼働) を指定します。パフォーマンスを向上させるために実行できる最も単純な処理の 1 つは、NODE_ENV を「production」に設定することです。 One of the simplest things you can do to improve performance is to set NODE_ENV to "production."

NODE_ENV を「production」に設定すると、Express は次のようになります。

- ビュー・テンプレートをキャッシュに入れる。
- CSS 拡張から生成された CSS ファイルをキャッシュに入れる。
- 詳細度の低いエラー・メッセージを生成する。

[テスト](http://apmblog.dynatrace.com/2015/07/22/the-drastic-effects-of-omitting-node_env-in-your-express-js-applications/)により、こうすると、アプリケーション・パフォーマンスが 3 倍も高くなることが示されています。

環境固有のコードを作成する必要がある場合は、`process.env.NODE_ENV` を使用して NODE_ENV の値を確認できます。どの環境変数の値を確認する場合でもパフォーマンスに悪影響が及ぶため、慎重に行ってください。 Be aware that checking the value of any environment variable incurs a performance penalty, and so should be done sparingly.

開発環境では、通常、対話式シェルで環境変数を設定します。例えば、`export` または `.bash_profile` ファイルを使用します。しかし、一般的には実動サーバーではそうしません。代わりに、OS の init システム (systemd または Upstart) を使用します。次のセクションでは、init システムの一般的な使用法について詳しく説明しています。ここで重点的に説明したのは、NODE_ENV の設定がパフォーマンスにとって極めて重要であるため (かつ簡単に実行できるため) です。 But in general, you shouldn't do that on a production server; instead, use your OS's init system (systemd or Upstart). The next section provides more details about using your init system in general, but setting `NODE_ENV` is so important for performance (and easy to do), that it's highlighted here.

Upstart では、ジョブ・ファイルで `env` キーワードを使用します。次に例を示します。 For example:

```sh
# /etc/init/env.conf
 env NODE_ENV=production
```

詳細については、[Upstart Intro, Cookbook and Best Practices](http://upstart.ubuntu.com/cookbook/#environment-variables) を参照してください。

systemd では、unit ファイルで `Environment` ディレクティブを使用します。次に例を示します。 For example:

```sh
# /etc/systemd/system/myservice.service
Environment=NODE_ENV=production
```

詳細については、[Using Environment Variables In systemd Units](https://coreos.com/os/docs/latest/using-environment-variables-in-systemd-units.html) を参照してください。

### アプリケーションが確実に自動再始動するようにする

In production, you don't want your application to be offline, ever. This means you need to make sure it restarts both if the app crashes and if the server itself crashes. Although you hope that neither of those events occurs, realistically you must account for both eventualities by:

- アプリケーション (および Node) が異常終了した場合にプロセス・マネージャーを使用してそれらを再始動する。
- Using the init system provided by your OS to restart the process manager when the OS crashes. It's also possible to use the init system without a process manager.

Node applications crash if they encounter an uncaught exception. The foremost thing you need to do is to ensure your app is well-tested and handles all exceptions (see [handle exceptions properly](#handle-exceptions-properly) for details). But as a fail-safe, put a mechanism in place to ensure that if and when your app crashes, it will automatically restart.

#### プロセス・マネージャーを使用する

開発環境では、単にコマンド・ラインから `node server.js` などを使用してアプリケーションを開始しています。ただし、この方法を実稼働環境で実行すると、危険を招くことになります。アプリケーションが異常終了した場合、アプリケーションは再始動されるまでオフラインになります。アプリケーションが異常終了した場合に確実に再始動するようにするには、プロセス・マネージャーを使用します。プロセス・マネージャーは、デプロイメントを容易に行えるようにして、高可用性を実現し、アプリケーションを実行時に管理できるようにする、アプリケーションの「コンテナー」です。 But doing this in production is a recipe for disaster. If the app crashes, it will be offline until you restart it. To ensure your app restarts if it crashes, use a process manager. A process manager is a "container" for applications that facilitates deployment, provides high availability, and enables you to manage the application at runtime.

アプリケーションを異常終了時に再始動することに加えて、プロセス・マネージャーでは以下が可能になります。

- ランタイム・パフォーマンスとリソース使用量に関するインサイトを得る。
- パフォーマンスを向上させるために設定を動的に変更する。
- クラスタリングを制御する (StrongLoop PM および pm2)。

Node 向けの最も一般的なプロセス・マネージャーは次のとおりです。

- [StrongLoop Process Manager](http://strong-pm.io/)
- [PM2](https://github.com/Unitech/pm2)
- [Forever](https://www.npmjs.com/package/forever)

3 つのプロセス・マネージャーの各機能の比較については、[http://strong-pm.io/compare/](http://strong-pm.io/compare/) を参照してください。

これらのプロセス・マネージャーのいずれかを使用すれば、時々異常終了してもアプリケーションの稼働状態を維持するのに十分です。

However, StrongLoop PM has lots of features that specifically target production deployment. You can use it and the related StrongLoop tools to:

- アプリケーションをローカル側で作成してパッケージし、実動システムのセキュアにデプロイする。
- 何らかの理由で異常終了したアプリケーションを自動的に再始動する。
- クラスターをリモート側で管理する。
- CPU プロファイルとヒープ・スナップショットを表示して、パフォーマンスを最適化し、メモリー・リークを診断する。
- アプリケーションのパフォーマンス・メトリックを表示する。
- Nginx ロード・バランサーの制御が統合された複数のホストに容易に拡張する。

As explained below, when you install StrongLoop PM as an operating system service using your init system, it will automatically restart when the system restarts. Thus, it will keep your application processes and clusters alive forever.

#### init システムの使用

The next layer of reliability is to ensure that your app restarts when the server restarts. Systems can still go down for a variety of reasons. To ensure that your app restarts if the server crashes, use the init system built into your OS. The two main init systems in use today are [systemd](https://wiki.debian.org/systemd) and [Upstart](http://upstart.ubuntu.com/).

Express アプリケーションで init システムを使用する方法は 2 つあります。

- Run your app in a process manager, and install the process manager as a service with the init system. The process manager will restart your app when the app crashes, and the init system will restart the process manager when the OS restarts. This is the recommended approach.
- init システムで直接、アプリケーション (および Node) を実行します。この方法の方が単純ですが、プロセス・マネージャーを使用する場合に得られる利点は得られません。 This is somewhat simpler, but you don't get the additional advantages of using a process manager.

##### Systemd

Systemd は、Linux システムとサービス・マネージャーです。大半の主要な Linux ディストリビューションでは、Systemd がデフォルトの init システムとして採用されています。 Most major Linux distributions have adopted systemd as their default init system.

Systemd サービス構成ファイルは、_unit ファイル_ という名前で、ファイル名の末尾は .service です。次に、Node アプリケーションを直接管理するための unit ファイルの例を示します (太字のテキストを、ご使用のシステムとアプリケーションの値に置き換えてください)。 Here's an example unit file to manage a Node app directly. Replace the values enclosed in `<angle brackets>` for your system and app:

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

Systemd について詳しくは、[systemd の解説 (man ページ)](http://www.freedesktop.org/software/systemd/man/systemd.unit.html) を参照してください。

##### Systemd サービスとしての StrongLoop PM

StrongLoop Process Manager を Systemd サービスとして簡単にインストールできます。インストール後、サーバーが再始動すると、StrongLoop PM が自動的に再始動され、管理対象アプリケーションのすべてが再始動されます。 After you do, when the server restarts, it will automatically restart StrongLoop PM, which will then restart all the apps it is managing.

StrongLoop PM を Systemd サービスとしてインストールするには、次のようにします。

```bash
$ sudo sl-pm-install --systemd
```

次に、サービスを開始します。

```bash
$ sudo /usr/bin/systemctl start strong-pm
```

詳しくは、[Setting up a production host (StrongLoop 資料)](https://docs.strongloop.com/display/SLC/Setting+up+a+production+host#Settingupaproductionhost-RHEL7+,Ubuntu15.04or15.10) を参照してください。

##### Upstart

Upstart は、多くの Linux ディストリビューションで提供されているシステム・ツールです。システム始動時にタスクとサービスを開始して、シャットダウン時にそれらを停止するほか、監視するために使用されます。Express アプリケーションまたはプロセス・マネージャーをサービスとして構成すると、Upstart が異常終了時に自動的に再始動します。 You can configure your Express app or process manager as a service and then Upstart will automatically restart it when it crashes.

Upstart サービスは、ファイル名が `.conf` で終わるジョブ構成ファイル (「ジョブ」とも呼ばれます) で定義されます。次の例は、`/projects/myapp/index.js` にあるメインファイルを使用して、「myapp」というアプリケーションの「myapp」というジョブを作成する方法を示しています。 The following example shows how to create a job called "myapp" for an app named "myapp" with the main file located at `/projects/myapp/index.js`.

以下の内容で `myapp.conf` というファイルを `/etc/init/` に作成します (太字のテキストを、ご使用のシステムとアプリケーションの値に置き換えてください)。

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

注: このスクリプトには、Ubuntu 12.04-14.10 でサポートされる Upstart 1.4 以降が必要です。 %}

ジョブは、システムの始動時に実行されるように構成されるため、アプリケーションは、オペレーティング・システムと並行して開始され、アプリケーションの異常終了時またはシステムの停止時に自動的に再始動されます。

アプリケーションの自動再始動のほか、Upstart では、以下のコマンドを使用できます。

- `start myapp` – アプリケーションの開始
- `restart myapp` – アプリケーションの再始動
- `stop myapp` – アプリケーションの停止

Upstart について詳しくは、[Upstart Intro, Cookbook and Best Practises](http://upstart.ubuntu.com/cookbook) を参照してください。

##### Upstart サービスとしての StrongLoop PM

StrongLoop Process Manager を Upstart サービスとして簡単にインストールできます。インストール後、サーバーが再始動すると、StrongLoop PM が自動的に再始動され、管理対象アプリケーションのすべてが再始動されます。 After you do, when the server restarts, it will automatically restart StrongLoop PM, which will then restart all the apps it is managing.

StrongLoop PM を Upstart 1.4 サービスとしてインストールするには、次のようにします。

```bash
$ sudo sl-pm-install
```

次に、サービスを実行します。

```bash
$ sudo /sbin/initctl start strong-pm
```

{% include admonitions/note.html content="On systems that don't support Upstart 1.4, the commands are slightly different. 注: Upstart 1.4 をサポートしないシステムでは、コマンドが若干異なります。詳しくは、[Setting up a production host (StrongLoop 資料)](https://docs.strongloop.com/display/SLC/Setting+up+a+production+host#Settingupaproductionhost-RHELLinux5and6,Ubuntu10.04-.10,11.04-.10) を参照してください。 %}

### アプリケーションをクラスターで実行する

マルチコア・システムでは、プロセスのクラスターを起動することで、Node アプリケーションのパフォーマンスを数倍も向上させることができます。クラスターは、アプリケーションの複数インスタンスを実行して (理想的には CPU コアごとに 1 つのインスタンス)、負荷とタスクをインスタンス間で分散させます。 A cluster runs multiple instances of the app, ideally one instance on each CPU core, thereby distributing the load and tasks among the instances.

![クラスター API を使用したアプリケーション・インスタンス間のバランシング](/images/clustering.png)

IMPORTANT: Since the app instances run as separate processes, they do not share the same memory space. That is, objects are local to each instance of the app. Therefore, you cannot maintain state in the application code. However, you can use an in-memory datastore like [Redis](http://redis.io/) to store session-related data and state. This caveat applies to essentially all forms of horizontal scaling, whether clustering with multiple processes or multiple physical servers.

In clustered apps, worker processes can crash individually without affecting the rest of the processes. Apart from performance advantages, failure isolation is another reason to run a cluster of app processes. クラスター・アプリケーションでは、ワーカー・プロセスは、残りのプロセスに影響を与えることなく、個々に異常終了することがあります。パフォーマンス上の利点の他に障害分離は、アプリケーション・プロセスのクラスターを実行するもう 1 つの理由です。ワーカー・プロセスが異常終了するたびに、必ず、イベントをログに記録して、cluster.fork() を使用して新規プロセスを作成してください。

#### Node のクラスター・モジュールの使用

Clustering is made possible with Node's [cluster module](https://nodejs.org/dist/latest-v4.x/docs/api/cluster.html). This enables a master process to spawn worker processes and distribute incoming connections among the workers. クラスタリングには、Node の[クラスター・モジュール](https://nodejs.org/api/cluster.html.)を使用します。このモジュールにより、マスター・プロセスは、ワーカー・プロセスを作成して、着信接続をワーカー間で分散させることができます。ただし、このモジュールを直接使用するよりも、[node-pm](https://www.npmjs.com/package/node-pm) や [cluster-service](https://www.npmjs.com/package/cluster-service) など、これらの処理を自動的に実行する多くのツールを使用する方がはるかに簡単です。

#### StrongLoop PM の使用

アプリケーションを StrongLoop Process Manager (PM) にデプロイする場合、アプリケーション・コードを変更_せずに_、クラスタリングを利用できます。

When running an application with PM2, you can enable **cluster mode** to run it in a cluster with a number of instances of your choosing, such as the matching the number of available CPUs on the machine. You can manually change the number of processes in the cluster using the `pm2` command line tool without stopping the app.

例えば、アプリケーションを prod.foo.com にデプロイして、StrongLoop PM がポート 8701 (デフォルト) で listen している場合は、slc を使用してクラスター・サイズを 8 に設定します。

```bash
$ slc ctl -C http://prod.foo.com:8701 set-size my-app 8
```

StrongLoop PM を使用したクラスタリングについて詳しくは、StrongLoop 資料の [Clustering](https://docs.strongloop.com/display/SLC/Clustering) を参照してください。

#### PM2 の使用

If you deploy your application with PM2, then you can take advantage of clustering _without_ modifying your application code.  You should ensure your [application is stateless](http://pm2.keymetrics.io/docs/usage/specifics/#stateless-apps) first, meaning no local data is stored in the process (such as sessions, websocket connections and the like).

When running an application with PM2, you can enable **cluster mode** to run it in a cluster with a number of instances of your choosing, such as the matching the number of available CPUs on the machine. You can manually change the number of processes in the cluster using the `pm2` command line tool without stopping the app.

To enable cluster mode, start your application like so:

```bash
# Start 4 worker processes
$ pm2 start app.js -i 4
# Auto-detect number of available CPUs and start that many worker processes
$ pm2 start app.js -i max
```

This can also be configured within a PM2 process file (`ecosystem.config.js` or similar) by setting `exec_mode` to `cluster` and `instances` to the number of workers to start.

Once running, a given application with the name `app` can be scaled like so:

```bash
# Add 3 more workers
$ pm2 scale app +3
# Scale to a specific number of workers
$ pm2 scale app 2
```

For more information on clustering with PM2, see [Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/) in the PM2 documentation.

### 要求の結果をキャッシュに入れる

実稼働環境のパフォーマンスを向上させるもう 1 つの戦略は、アプリケーションが同じ要求に何回も対応するために操作を繰り返すことがないように、要求の結果をキャッシュに入れることです。

[Varnish](https://www.varnish-cache.org/) や [Nginx](https://www.nginx.com/resources/wiki/start/topics/examples/reverseproxycachingexample/) ([Nginx Caching](https://serversforhackers.com/nginx-caching/) も参照) などのキャッシュ・サーバーを使用すると、アプリケーションの速度とパフォーマンスを大幅に向上させることができます。

### [ロード・バランサーを使用する](#use-a-load-balancer)

アプリケーションがどれだけ最適化されていても、単一インスタンスは、限られた量の負荷とトラフィックしか処理できません。アプリケーションを拡張する 1 つの方法は、複数インスタンスを実行して、ロード・バランサーを使用してトラフィックを分散させることです。ロード・バランサーをセットアップすると、アプリケーションのパフォーマンスと速度を向上させることができ、単一インスタンスよりも大規模に拡張できます。 One way to scale an app is to run multiple instances of it and distribute the traffic via a load balancer. Setting up a load balancer can improve your app's performance and speed, and enable it to scale more than is possible with a single instance.

A load balancer is usually a reverse proxy that orchestrates traffic to and from multiple application instances and servers. ロード・バランサーは通常、複数のアプリケーション・インスタンスやサーバーとの間のトラフィックを調整するリバース・プロキシーです。[Nginx](http://nginx.org/en/docs/http/load_balancing.html) や [HAProxy](https://www.digitalocean.com/community/tutorials/an-introduction-to-haproxy-and-load-balancing-concepts) を使用して、アプリケーション用にロード・バランサーを簡単にセットアップできます。

With load balancing, you might have to ensure that requests that are associated with a particular session ID connect to the process that originated them. This is known as _session affinity_, or _sticky sessions_, and may be addressed by the suggestion above to use a data store such as Redis for session data (depending on your application). For a discussion, see [Using multiple nodes](https://socket.io/docs/v4/using-multiple-nodes/).

### [リバース・プロキシーを使用する](#use-a-reverse-proxy)

A reverse proxy sits in front of a web app and performs supporting operations on the requests, apart from directing requests to the app. It can handle error pages, compression, caching, serving files, and load balancing among other things.

アプリケーションの状態を知る必要のないタスクをリバース・プロキシーに引き渡すことで、Express が解放されて、特殊なアプリケーション・タスクを実行できるようになります。この理由から、実稼働環境で Express を [Nginx](https://www.nginx.com/) や [HAProxy](http://www.haproxy.org/) などのリバース・プロキシーの背後で実行することをお勧めします。 For this reason, it is recommended to run Express behind a reverse proxy like [Nginx](https://www.nginx.com/) or [HAProxy](http://www.haproxy.org/) in production.
