const dbQueries = require('../dbQueries')
const mongoID = require('mongodb').ObjectID
const sendJSON = require('../methodes/sendJSON')
const sendError = require('../methodes/sendError')

const articles = (socket, io, db, user) => {
  socket.on('articles/insert', async (req, callback) => {
    try {
      const query = {
        type: req.type,
        imageList: [],
        count: 0,
        fr: { name: '', description: '' },
        en: { name: '', description: '' }
      }
      if (req.type === 'pocket') query.category = ''
      const _id = await dbQueries.insertOne(db, 'articles', query)
      sendJSON(callback, { _id, ...query })
    } catch (err) {
      sendError(callback, err)
    }
  })
  socket.on('articles/push/image', async (req, callback) => {
    try {
      let param = { _id: mongoID(req._id) }
      const imageQuery = {
        name: req.image.name,
        type: req.image.type,
        size: req.image.size,
        url: req.image.url,
        width: req.image.width,
        height: req.image.height
      }
      const imageId = await socket._events['files/insert'](imageQuery)

      const query = { $push: { imageList: imageId } }
      await dbQueries.updateOne(db, 'articles', param, query)
      sendJSON(callback, 'image added')
    } catch (err) {
      sendError(callback, err)
    }
  })
  socket.on('articles/edit', async (req, callback) => {
    try {
      let param = { _id: mongoID(req._id) }
      const data = {
        imageList: req.imageList.map(obj => mongoID(obj._id)),
        count: req.count,
        category: req.category ? mongoID(req.category) : '',
        fr: { name: req.fr.name, description: req.fr.description },
        en: { name: req.en.name, description: req.en.description }
      }
      const query = { $set: data }
      await dbQueries.updateOne(db, 'articles', param, query)
      sendJSON(callback, { ...data, ...param })
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('articles/remove', async (req, callback) => {
    try {
      // delete post
      const query = { _id: mongoID(req._id) }
      await dbQueries.removeOne(db, 'articles', query)
      sendJSON(callback)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('articles/list', async (req, callback) => {
    try {
      let list = await dbQueries.findArticles(db, { type: req.type })
      sendJSON(callback, list)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('articles/set/order', async (req, callback) => {
    try {
      req.idList.forEach((_id, index) => {
        const query = { _id: mongoID(_id) }
        dbQueries.updateOne(db, 'articles', query, { $set: { order: index } })
      })
      sendJSON(callback, 'orderChanged')
    } catch (err) {
      sendError(callback, err)
    }
  })
}

module.exports = articles
