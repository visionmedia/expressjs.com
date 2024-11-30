---
layout: page
title: Integración de la base de datos de Express
menu: guide
lang: es
description: Discover how to integrate various databases with Express.js applications,
  including setup examples for MongoDB, MySQL, PostgreSQL, and more.
---

# Integración de la base de datos

La adición de la funcionalidad de conectar bases de datos a las aplicaciones Express se consigue simplemente cargando el controlador de Node.js adecuado para la base de datos en la aplicación. En este documento se describe brevemente cómo añadir y utilizar algunos de los módulos de Node.js más conocidos para los sistemas de base de datos en la aplicación Express:

* [Cassandra](#cassandra)
* [CouchDB](#couchdb)
* [LevelDB](#leveldb)
* [MySQL](#mysql)
* [MongoDB](#mongo)
* [Neo4j](#neo4j)
* [Oracle](#oracle)
* [PostgreSQL](#postgres)
* [Redis](#redis)
* [SQLite](#sqlite)
* [ElasticSearch](#elasticsearch)

<div class="doc-box doc-notice" markdown="1">
Estos son algunos de los muchos controladores de base de datos que hay disponibles.  Para ver otras opciones, realice búsquedas en el sitio [npm](https://www.npmjs.com/).
</div>

<a name="cassandra"></a>

## Cassandra

**Módulo**: [cassandra-driver](https://github.com/datastax/nodejs-driver)
**Instalación**

```console
$ npm install cassandra-driver
```

**Ejemplo**

```js
const cassandra = require('cassandra-driver')
const client = new cassandra.Client({ contactPoints: ['localhost'] })

client.execute('select key from system.local', (err, result) => {
  if (err) throw err
  console.log(result.rows[0])
})
```

<a name="couchdb"></a>

## CouchDB

**Módulo**: [nano](https://github.com/dscape/nano)
**Instalación**

```console
$ npm install nano
```

**Ejemplo**

```js
const nano = require('nano')('http://localhost:5984')
nano.db.create('books')
const books = nano.db.use('books')

// Insert a book document in the books database
books.insert({ name: 'The Art of war' }, null, (err, body) => {
  if (err) {
    console.log(err)
  } else {
    console.log(body)
  }
})

// Get a list of all books
books.list((err, body) => {
  if (err) {
    console.log(err)
  } else {
    console.log(body.rows)
  }
})
```

<a name="leveldb"></a>

## LevelDB

**Módulo**: [levelup](https://github.com/rvagg/node-levelup)
**Instalación**

```console
$ npm install level levelup leveldown
```

**Ejemplo**

```js
const levelup = require('levelup')
const db = levelup('./mydb')

db.put('name', 'LevelUP', (err) => {
  if (err) return console.log('Ooops!', err)

  db.get('name', (err, value) => {
    if (err) return console.log('Ooops!', err)

    console.log(`name=${value}`)
  })
})
```

<a name="mysql"></a>

## MySQL

**Módulo**: [mysql](https://github.com/felixge/node-mysql/)
**Instalación**

```console
$ npm install mysql
```

**Ejemplo**

```js
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'dbuser',
  password: 's3kreee7',
  database: 'my_db'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end()
```

<a name="mongo"></a>

## MongoDB

**Módulo**: [mongodb](https://github.com/mongodb/node-mongodb-native)
**Instalación**

```console
$ npm install mongodb
```

**Ejemplo**

```js
const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/animals', (err, db) => {
  if (err) throw err

  db.collection('mammals').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
  })
})
```
Si desea un controlador de modelo de objeto para MongoDB, consulte [Mongoose](https://github.com/LearnBoost/mongoose).

<a name="neo4j"></a>

## Neo4j

**Módulo**: [neo4j-driver](https://github.com/neo4j/neo4j-javascript-driver)
**Instalación**

```console
$ npm install neo4j-driver
```

**Ejemplo**

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

<a name="oracle"></a>

## Oracle

**Módulo**: [oracledb](https://github.com/oracle/node-oracledb)

### Instalación

NOTA: [Vea los requisitos previos de instalación](https://github.com/oracle/node-oracledb#-installation).

```console
$ npm install oracledb
```

### Ejemplo

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


<a name="postgres"></a>

## PostgreSQL

**Módulo**: [pg-promise](https://github.com/vitaly-t/pg-promise)
**Instalación**

```console
$ npm install pg-promise
```

**Ejemplo**

```js
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://username:password@host:port/database')

db.one('SELECT $1 AS value', 123)
  .then((data) => {
    console.log('DATA:', data.value)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })
```

<a name="redis"></a>

## Redis

**Módulo**: [redis](https://github.com/mranney/node_redis)
**Instalación**

```console
$ npm install redis
```

**Ejemplo**

```js
const redis = require('redis')
const client = redis.createClient()

client.on('error', (err) => {
  console.log(`Error ${err}`)
})

client.set('string key', 'string val', redis.print)
client.hset('hash key', 'hashtest 1', 'some value', redis.print)
client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print)

client.hkeys('hash key', (err, replies) => {
  console.log(`${replies.length} replies:`)

  replies.forEach((reply, i) => {
    console.log(`    ${i}: ${reply}`)
  })

  client.quit()
})
```

<a name="sqlite"></a>

## SQLite

**Módulo**: [sqlite3](https://github.com/mapbox/node-sqlite3)
**Instalación**

```console
$ npm install sqlite3
```

**Ejemplo**

```js
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

db.serialize(() => {
  db.run('CREATE TABLE lorem (info TEXT)')
  const stmt = db.prepare('INSERT INTO lorem VALUES (?)')

  for (let i = 0; i < 10; i++) {
    stmt.run(`Ipsum ${i}`)
  }

  stmt.finalize()

  db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
    console.log(`${row.id}: ${row.info}`)
  })
})

db.close()
```

<a name="elasticsearch"></a>

## ElasticSearch

**Módulo**: [elasticsearch](https://github.com/elastic/elasticsearch-js)
**Instalación**

```console
$ npm install elasticsearch
```

**Ejemplo**

```js
const elasticsearch = require('elasticsearch')
const client = elasticsearch.Client({
  host: 'localhost:9200'
})

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
}).then((response) => {
  const hits = response.hits.hits
}, (error) => {
  console.trace(error.message)
})
```
