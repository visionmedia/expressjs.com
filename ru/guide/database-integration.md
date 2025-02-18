---
layout: page
title: Интеграция Express с базами данных
description: Discover how to integrate various databases with Express.js applications, including setup examples for MongoDB, MySQL, PostgreSQL, and more.
menu: guide
lang: ru
redirect_from: /guide/database-integration.html
---

# Интеграция с базами данных

Для того чтобы добавить функциональную возможность подключения базы данных к приложению Express, необходимо всего лишь загрузить в ваше приложение драйвер Node.js для соответствующей базы данных. В настоящем документе кратко описан способ добавления и использования в приложении Express некоторых наиболее популярных моделей Node.js для систем баз данных:

- [Cassandra](#cassandra)
- [Couchbase](#couchbase)
- [CouchDB](#couchdb)
- [LevelDB](#leveldb)
- [MySQL](#mysql)
- [MongoDB](#mongo)
- [Neo4j](#neo4j)
- [Oracle](#oracle)
- [PostgreSQL](#postgres)
- [Redis](#redis)
- <a name="mysql"></a>
- [SQLite](#sqlite)
- [ElasticSearch](#elasticsearch)

<div class="doc-box doc-notice" markdown="1">
Это неполный список доступных драйверов баз данных. С другими вариантами можно ознакомиться на сайте [npm](https://www.npmjs.com/).
</div>

## Cassandra

**Модуль**: [cassandra-driver](https://github.com/datastax/nodejs-driver) -
**Установка**

### Installation

```bash
$ npm install cassandra-driver
```

### Example

```js
<code class="language-javascript" translate="no">
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['localhost']});

client.execute('select key from system.local', function(err, result) {
  if (err) throw err;
  console.log(result.rows[0]);
});
</code>

```

## Couchbase

**Module**: [couchnode](https://github.com/couchbase/couchnode)

### Installation

```bash
<a name="couchdb"></a>
```

### Example

```js
const couchbase = require('couchbase')
const bucket = (new couchbase.Cluster('http://localhost:8091')).openBucket('bucketName')

// add a document to a bucket
bucket.insert('document-key', { name: 'Matt', shoeSize: 13 }, (err, result) => {
  if (err) {
    console.log(err)
  } else {
    console.log(result)
  }
})

// get all documents with shoe size 13
const n1ql = 'SELECT d.* FROM `bucketName` d WHERE shoeSize = $1'
const query = N1qlQuery.fromString(n1ql)
bucket.query(query, [13], (err, result) => {
  if (err) {
    console.log(err)
  } else {
    console.log(result)
  }
})
```

## CouchDB

**Модуль**: [nano](https://github.com/dscape/nano) -
**Установка**

### Installation

```bash
$ npm install nano
```

### Example

```js
<code class="language-javascript" translate="no">
var nano = require('nano')('http://localhost:5984');
nano.db.create('books');
var books = nano.db.use('books');

//Insert a book document in the books database
books.insert({name: 'The Art of war'}, null, function(err, body) {
  if (!err){
    console.log(body);
  }
});

//Get a list of all books
books.list(function(err, body){
  console.log(body.rows);
});
</code>

```

## LevelDB

**Модуль**: [levelup](https://github.com/rvagg/node-levelup) -
**Установка**

### Installation

```bash
$ npm install level levelup leveldown
```

### Example

```js
<code class="language-javascript" translate="no">
var levelup = require('levelup');
var db = levelup('./mydb');

db.put('name', 'LevelUP', function (err) {

  if (err) return console.log('Ooops!', err);
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err);
    console.log('name=' + value);
  });

});
</code>

```

## MySQL

**Модуль**: [mysql](https://github.com/felixge/node-mysql/) -
**Установка**

### Installation

```bash
$ npm install mysql
```

### Example

```js
<code class="language-javascript" translate="no">
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dbuser',
  password : 's3kreee7'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

connection.end();
</code>

```

## MongoDB

**Модуль**: [mongodb](https://github.com/mongodb/node-mongodb-native) -
**Установка**

### Installation

```bash
$ npm install mongodb
```

### Example (v2.\*)

```js
<code class="language-javascript" translate="no">
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) {
  if (err) {
    throw err;
  }
  db.collection('mammals').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
});
</code>

```

### Example (v3.\*)

```js
<a name="mongo"></a>
```

Если вам необходим драйвер объектной модели для MongoDB, его можно найти на странице [Mongoose](https://github.com/LearnBoost/mongoose).

## Neo4j

**Модуль**: [apoc](https://github.com/hacksparrow/apoc) -
**Установка**

### Installation

```bash
<a name="neo4j"></a>
```

### Example

```js
const neo4j = require('neo4j-driver')
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'letmein'))

const session = driver.session()

session.readTransaction((tx) => {
  return tx.run('MATCH (n) RETURN count(n) AS count')
    .then((res) => {
      console.log(res.records[0].get('count'))
    })
    .catch((error) => {
      console.log(error)
    })
})
```

## Oracle

**Module**: [oracledb](https://github.com/oracle/node-oracledb)

### Installation

NOTE: [See installation prerequisites](https://github.com/oracle/node-oracledb#-installation).

```bash
<a name="sqlite"></a>
```

### Example

```js
const oracledb = require('oracledb')
const config = {
  user: '<your db user>',
  password: '<your db password>',
  connectString: 'localhost:1521/orcl'
}

async function getEmployee (empId) {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(
      'select * from employees where employee_id = :id',
      [empId]
    )

    console.log(result.rows[0])
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

getEmployee(101)
```

## PostgreSQL

**Модуль**: [pg-promise](https://github.com/vitaly-t/pg-promise) -
**Установка**

### Installation

```bash
$ npm install pg-promise
```

### Example

```js
<code class="language-javascript" translate="no">
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://username:password@host:port/database");

db.one("SELECT $1 AS value", 123)
    .then(function (data) {
        console.log("DATA:", data.value);
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
</code>

```

## Redis

**Модуль**: [redis](https://github.com/mranney/node_redis) -
**Установка**

### Installation

```bash
$ npm install redis
```

### Example

```js
<code class="language-javascript" translate="no">
var client = require('redis').createClient();

client.on('error', function (err) {
  console.log('Error ' + err);
});

client.set('string key', 'string val', redis.print);
client.hset('hash key', 'hashtest 1', 'some value', redis.print);
client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print);

client.hkeys('hash key', function (err, replies) {

  console.log(replies.length + ' replies:');
  replies.forEach(function (reply, i) {
    console.log('    ' + i + ': ' + reply);
  });

  client.quit();

});
</code>

```

## SQL Server

**Module**: [tedious](https://github.com/tediousjs/tedious)

### Installation

```bash
$ npm install apoc
```

### Example

```js
const Connection = require('tedious').Connection
const Request = require('tedious').Request

const config = {
  server: 'localhost',
  authentication: {
    type: 'default',
    options: {
      userName: 'your_username', // update me
      password: 'your_password' // update me
    }
  }
}

const connection = new Connection(config)

connection.on('connect', (err) => {
  if (err) {
    console.log(err)
  } else {
    executeStatement()
  }
})

function executeStatement () {
  request = new Request("select 123, 'hello world'", (err, rowCount) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`${rowCount} rows`)
    }
    connection.close()
  })

  request.on('row', (columns) => {
    columns.forEach((column) => {
      if (column.value === null) {
        console.log('NULL')
      } else {
        console.log(column.value)
      }
    })
  })

  connection.execSql(request)
}
```

## SQLite

**Модуль**: [sqlite3](https://github.com/mapbox/node-sqlite3) -
**Установка**

### Installation

```bash
$ npm install sqlite3
```

### Example

```js
<code class="language-javascript" translate="no">
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {

  db.run('CREATE TABLE lorem (info TEXT)');
  var stmt = db.prepare('INSERT INTO lorem VALUES (?)');

  for (var i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i);
  }

  stmt.finalize();

  db.each('SELECT rowid AS id, info FROM lorem', function(err, row) {
    console.log(row.id + ': ' + row.info);
  });
});

db.close();
</code>

```

## ElasticSearch

**Модуль**: [elasticsearch](https://github.com/elastic/elasticsearch-js) -
**Установка**

### Installation

```bash
$ npm install elasticsearch
```

### Example

```js
<code class="language-javascript" translate="no">
var elasticsearch = require('elasticsearch');
var client = elasticsearch.Client({
  host: 'localhost:9200'
});

client.search({
  index: 'books',
  type: 'book',
  body: {
    query: {
      multi_match: {
        query: 'express js',
        fields: ['title', 'description']
      }
    }
  }
}).then(function(response) {
  var hits = response.hits.hits;
}, function(error) {
  console.trace(error.message);
});
</code>

```
