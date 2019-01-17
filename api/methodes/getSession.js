const dbQueries = require('../dbQueries')
const mongoID = require('mongodb').ObjectID
const getSession = async (socket, io, db) => {
  let user
  try {
    let _id = socket.request._query.session
    if (!_id || _id.length !== 24) return null
    const session = await dbQueries.findOne(db, 'sessions', { _id: mongoID(_id) })
    if (!session) return null
    user = await dbQueries.findOne(db, 'users', { _id: session.userId })
  } catch (err) {
    console.log(err)
  }
  return user
}
module.exports = getSession
