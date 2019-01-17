const assert = require('assert')
const MongoClient = require('mongodb').MongoClient

// database properties
const url = 'mongodb://localhost:27017'
const dbName = 'salsabil_dev'

// start database connection
let db
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) console.error(err)
  console.log(`Connected to ${dbName} database`)
  db = client.db(dbName)
})
describe('db queries', () => {
  it('connect to db', (done) => {
    setTimeout(() => {
      assert(db !== undefined)
    }, 10)
    done()
  })

  it('get posts/list', (done) => {
    setTimeout(async () => {

    }, 0)
    done()
  })
})
