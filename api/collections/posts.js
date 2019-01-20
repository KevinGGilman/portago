const dbQueries = require('../dbQueries')
const mongoID = require('mongodb').ObjectID
const sendJSON = require('../methodes/sendJSON')
const sendError = require('../methodes/sendError')

const posts = (socket, io, db, user) => {
  socket.on('posts/insert', async (req, callback) => {
    try {
      const query = {
        fr: { content: '' },
        en: { content: '' }
      }

      const _id = await dbQueries.insertOne(db, 'posts', query)
      sendJSON(callback, { _id, ...query })
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('posts/edit', async (req, callback) => {
    try {
      let param = { _id: mongoID(req._id) }
      const data = {
        fr: { content: req.fr.content },
        en: { content: req.en.content }
      }
      const query = { $set: data }
      await dbQueries.updateOne(db, 'posts', param, query)
      sendJSON(callback, { ...data, ...param })
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('posts/remove', async (req, callback) => {
    try {
      // delete post
      const query = { _id: mongoID(req._id) }
      await dbQueries.removeOne(db, 'posts', query)
      sendJSON(callback)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('posts/list', async (req, callback) => {
    try {
      let list = await dbQueries.find(db, 'posts', {}, { sort: { order: 1 } })
      sendJSON(callback, list)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('posts/set/order', async (req, callback) => {
    try {
      req.idList.forEach((_id, index) => {
        const query = { _id: mongoID(_id) }
        dbQueries.updateOne(db, 'posts', query, { $set: { order: index } })
      })
      sendJSON(callback, 'orderChanged')
    } catch (err) {
      sendError(callback, err)
    }
  })
}

module.exports = posts
