const dbQueries = require('../dbQueries')
const sendJSON = require('../methodes/sendJSON')
const sendError = require('../methodes/sendError')
const mongoID = require('mongodb').ObjectID
const files = (socket, io, db, user) => {
  socket.on('files/insert', async (req, callback) => {
    let fileId
    try {
      const query = {
        name: req.name,
        type: req.type,
        size: req.size
      }
      if (req.data) query.data = Object.values(req.data).join('.')
      if (req.url) {
        query.width = req.width
        query.height = req.height
        query.url = req.url
      }
      query.createdAt = new Date()
      fileId = await dbQueries.insertOne(db, 'files', query)
      sendJSON(callback, fileId)
    } catch (err) {
      sendError(callback, err)
    }
    return fileId
  })
  socket.on('files/set/image', async (req, callback) => {
    let fileId
    try {
      const data = {
        name: req.name,
        type: req.type,
        size: req.size,
        width: req.width,
        height: req.height,
        url: req.url
      }
      const param = { _id: mongoID(req._id) }
      data.createdAt = new Date()
      const query = { $set: data }
      fileId = await dbQueries.updateOne(db, 'files', param, query)
      sendJSON(callback, fileId)
    } catch (err) {
      sendError(callback, err)
    }
    return fileId
  })
  socket.on('files/data', async (req, callback) => {
    try {
      const file = await dbQueries.findOne(db, 'files', { _id: mongoID(req._id) })
      sendJSON(callback, file.data)
    } catch (err) {
      sendError(callback, err)
    }
  })
}
module.exports = files
