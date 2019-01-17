const dbQueries = require('../dbQueries')
const bcrypt = require('bcrypt')
const sendJSON = require('../methodes/sendJSON')
const sendError = require('../methodes/sendError')
const mongoID = require('mongodb').ObjectID
const users = (socket, io, db, user) => {
  socket.on('users/insert', async (req, callback) => {
    try {
      const existingUser = await dbQueries.findOne(db, 'users', { email: req.email })
      if (existingUser) throw new Error('userAlreadyExists')
      const password = await cryptPassword(req.password)
      const query = {
        firstName: req.firstName,
        lastName: req.lastName,
        fullName: req.firstName + ' ' + req.lastName,
        email: req.email,
        password: password
      }
      const _id = await dbQueries.insertOne(db, 'users', query)
      sendJSON(callback, { ...user, _id })
    } catch (err) {
      sendError(callback, err)
    }
  })
  socket.on('users/logout', async (callback) => {
    try {
      const query = {
        _id: mongoID(socket.request._query.session),
        userId: mongoID(user._id)
      }
      await dbQueries.removeOne(db, 'sessions', query)
      sendJSON(callback, user)
    } catch (err) {
      sendError(callback, err)
    }
  })
  socket.on('users/update', async (req, callback) => {
    try {
      let data = {
        image: req.image,
        firstName: req.firstName,
        lastName: req.lastName,
        fullName: req.firstName ? `${req.firstName} ${req.lastName}` : undefined,
        phone: req.phone,
        facebook: req.facebook,
        linkedIn: req.linkedIn,
        bookmarkList: req.bookmarkList ? req.bookmarkList.map(_id => mongoID(_id)) : undefined,
        lastUsedGroup: req.lastUsedGroup ? mongoID(req.lastUsedGroup) : undefined
      }
      let query = {}
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) {
          user[key] = data[key]
          query[key] = data[key]
        }
      })
      query = { $set: query }
      await dbQueries.updateOne(db, 'users', { _id: user._id }, query)
      sendJSON(callback, user)
    } catch (err) {
      sendError(callback, err)
    }
  })
  socket.on('users/self', async (req, callback) => {
    try {
      sendJSON(callback, user)
    } catch (err) {
      sendError(callback, err)
    }
  })
}
module.exports = users

function cryptPassword (password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err)
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err)
        else resolve(hash)
      })
    })
  })
};
