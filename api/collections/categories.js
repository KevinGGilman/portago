const dbQueries = require('../dbQueries')
const mongoID = require('mongodb').ObjectID
const sendJSON = require('../methodes/sendJSON')
const sendError = require('../methodes/sendError')

const categories = (socket, io, db, user) => {
  socket.on('categories/insert', async (req, callback) => {
    try {
      const imageQuery = {
        name: req.image.name,
        type: req.image.type,
        size: req.image.size,
        url: req.image.url,
        width: req.image.width,
        height: req.image.height
      }
      const imageId = await socket._events['files/insert'](imageQuery)
      const query = {
        image: imageId,
        fr: '',
        en: ''
      }

      const _id = await dbQueries.insertOne(db, 'categories', query)
      sendJSON(callback, { _id, ...query, image: imageQuery })
    } catch (err) {
      sendError(callback, err)
    }
  })
  socket.on('categories/edit', async (req, callback) => {
    try {
      let param = { _id: mongoID(req._id) }
      const data = {
        fr: req.fr,
        en: req.en
      }
      const query = { $set: data }
      await dbQueries.updateOne(db, 'categories', param, query)
      sendJSON(callback, { ...data, ...param })
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('categories/remove', async (req, callback) => {
    try {
      // delete post
      const query = { _id: mongoID(req._id) }
      await dbQueries.removeOne(db, 'categories', query)
      sendJSON(callback)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('categories/list', async (req, callback) => {
    try {
      let list = await dbQueries.find(db, 'categories', {})
      list = await Promise.all(list.map(async (item, index) => {
        item.image = await dbQueries.findOne(db, 'files', { _id: item.image })
        if (item.customIcon) {
          item.customIcon = await dbQueries.findOne(db, 'files', { _id: item.customIcon })
        }
        return item
      }))
      sendJSON(callback, list)
    } catch (err) {
      sendError(callback, err)
    }
  })
}

module.exports = categories
