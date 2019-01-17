const dbQueries = require('./dbQueries')
const sendJSON = require('./methodes/sendJSON')
const sendError = require('./methodes/sendError')
const bcrypt = require('bcrypt')
const publicRequests = (socket, io, db, user) => {
  socket.on('users/self', async (req, callback) => {
    const errorMessage = 'notLoggedIn'
    callback(errorMessage)
  })
  socket.on('users/login', async (req, callback) => {
    try {
      const user = await dbQueries.findOne(db, 'users', { email: req.email })
      const isValidPassword = await comparePassword(req.password, user.password)
      if (!user) throw new Error('userDoesntExists')
      if (!isValidPassword) throw new Error('badPassword')
      const _id = await dbQueries.insertOne(db, 'sessions', { userId: user._id })
      sendJSON(callback, { _id })
    } catch (err) {
      sendError(callback, err)
    }
  })
}
module.exports = publicRequests

function comparePassword (plainPass, hashword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPass, hashword, (err, isPasswordMatch) => {
      if (err) reject(new Error(err))
      else resolve(isPasswordMatch)
    })
  })
}
