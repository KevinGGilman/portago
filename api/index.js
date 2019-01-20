const path = require('path')
const MongoClient = require('mongodb').MongoClient
const getSession = require(`./methodes/getSession`)
const express = require('express')
const app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

const idDEV = !process.env.PORT
const port = process.env.PORT || 8080

const dataBase = {
  urlDev: 'mongodb://localhost:27017',
  url: 'mongodb+srv://kevinggilman:Patate44@portago-ssc4v.mongodb.net',
  name: 'portago'
}

const collectionList = [
  'users', 'files', 'carousel', 'locations', 'posts'
]
http.listen(port, () => {
  console.log(`listening on port ${port}`)
})

if (!idDEV) {
  app.use(express.static(path.join(__dirname, '..', 'build')))

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
  })
}

function startDatabase () {
  const { urlDev, url, name } = dataBase
  return new Promise((resolve, reject) => {
    MongoClient.connect(idDEV ? urlDev : url, { useNewUrlParser: true }, (err, client) => {
      if (err) reject(err)
      console.log(`Connected to ${name} database`)
      resolve(client.db(name))
    })
  })
}
async function connectSockets () {
  const db = await startDatabase()
  // prepare web sockets
  const loggedSet = {}
  io.on('connection', async socket => {
    console.log('user connected')
    const user = await getSession(socket, io, db)
    if (!user) {
      const publicRequestsModule = require(`./publicRequests`)
      publicRequestsModule(socket, io, db)
    } else {
      loggedSet[user._id.toString()] = true
      collectionList.forEach((key) => {
        const collectionModule = require(`./collections/${key}`)
        collectionModule(socket, io, db, user, loggedSet)
      })
    }
    socket.on('disconnect', () => {
      if (user) loggedSet[user._id.toString()] = false
    })
  })
}

connectSockets()
