const dbQueries = require('../dbQueries')
const mongoID = require('mongodb').ObjectID
const sendJSON = require('../methodes/sendJSON')
const sendError = require('../methodes/sendError')
const posts = (socket, io, db, user) => {
  socket.on('carousel/insert', async (req, callback) => {
    try {
      const query = {
        faIcon: '',
        faType: 'Solid',
        fr: { title: '', descrition: '' },
        en: { title: '', descrition: '' }
      }
      const imageQuery = {
        name: req.image.name,
        type: req.image.type,
        size: req.image.size,
        url: req.image.url,
        width: req.image.width,
        height: req.image.height
      }
      const imageId = await socket._events['files/insert'](imageQuery)
      query.image = imageId

      const _id = await dbQueries.insertOne(db, 'carousel', query)
      sendJSON(callback, { _id, ...query, image: imageQuery })
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('carousel/edit', async (req, callback) => {
    try {
      const data = {
        fr: { title: req.fr.title, description: req.fr.description },
        en: { title: req.en.title, description: req.en.description },
        faIcon: req.faIcon,
        faType: req.faType
      }

      if (req.image) {
        const imageQuery = {
          name: req.image.name,
          type: req.image.type,
          size: req.image.size,
          url: req.image.url,
          width: req.image.width,
          height: req.image.height
        }
        const imageId = await socket._events['files/insert'](imageQuery)
        data.image = imageId
      }
      if (req.customIcon) {
        const iconQuery = {
          name: req.customIcon.name,
          type: req.customIcon.type,
          size: req.customIcon.size,
          url: req.customIcon.url,
          width: req.customIcon.width,
          height: req.customIcon.height
        }
        const iconId = await socket._events['files/insert'](iconQuery)
        data.customIcon = iconId
      }
      let query = {}
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) query[key] = data[key]
      })
      query = { $set: query }
      let param = { _id: mongoID(req._id) }
      const updatedItem = await dbQueries.updateOne(db, 'carousel', param, query)
      sendJSON(callback, updatedItem)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('carousel/remove', async (req, callback) => {
    try {
      // delete post
      const query = { _id: mongoID(req._id) }
      await dbQueries.removeOne(db, 'carousel', query)
      sendJSON(callback)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('carousel/list', async (req, callback) => {
    try {
      let list = await dbQueries.find(db, 'carousel', {}, { sort: { order: 1 } })
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

  socket.on('carousel/set/order', async (req, callback) => {
    try {
      req.idList.forEach((_id, index) => {
        const query = { _id: mongoID(_id) }
        dbQueries.updateOne(db, 'carousel', query, { $set: { order: index } })
      })
      sendJSON(callback, 'orderChanged')
    } catch (err) {
      sendError(callback, err)
    }
  })
}

module.exports = posts
