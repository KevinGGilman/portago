const dbQueries = require('../dbQueries')
const mongoID = require('mongodb').ObjectID
const sendJSON = require('../methodes/sendJSON')
const sendError = require('../methodes/sendError')
const googleMaps = require('@google/maps')

const posts = (socket, io, db, user) => {
  socket.on('locations/insert', async (req, callback) => {
    try {
      const query = {
        lng: '',
        lat: '',
        fr: { address: '', descrition: '' },
        en: { address: '', descrition: '' }
      }

      const _id = await dbQueries.insertOne(db, 'locations', query)
      sendJSON(callback, { _id, ...query })
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('locations/edit', async (req, callback) => {
    try {
      let param = { _id: mongoID(req._id) }
      const frData = await geocode({ address: req.fr.address || req.en.address })
      const enData = await geocode({ address: req.fr.address || req.en.address, language: 'en' })
      const data = {
        fr: { address: frData.json.results[0].formatted_address, description: req.fr.description },
        en: { address: enData.json.results[0].formatted_address, description: req.en.description },
        ...frData.json.results[0].geometry.location
      }
      const query = { $set: data }
      await dbQueries.updateOne(db, 'locations', param, query)
      sendJSON(callback, { ...data, ...param })
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('locations/remove', async (req, callback) => {
    try {
      // delete post
      const query = { _id: mongoID(req._id) }
      await dbQueries.removeOne(db, 'locations', query)
      sendJSON(callback)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('locations/list', async (req, callback) => {
    try {
      let list = await dbQueries.find(db, 'locations', {}, { sort: { order: 1 } })
      sendJSON(callback, list)
    } catch (err) {
      sendError(callback, err)
    }
  })

  socket.on('locations/set/order', async (req, callback) => {
    try {
      req.idList.forEach((_id, index) => {
        const query = { _id: mongoID(_id) }
        dbQueries.updateOne(db, 'locations', query, { $set: { order: index } })
      })
      sendJSON(callback, 'orderChanged')
    } catch (err) {
      sendError(callback, err)
    }
  })
}

module.exports = posts

function geocode (params) {
  const key = 'AIzaSyDGloI_9FzwRcXO3KrlYMYdjlbVdiAlRJw'
  const mapsClient = googleMaps.createClient({ key: key })
  return new Promise((resolve, reject) => {
    mapsClient.geocode(params, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
