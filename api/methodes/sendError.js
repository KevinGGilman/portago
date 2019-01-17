function sendError (callback, err) {
  console.log(err)
  var plainObject = {}
  Object.getOwnPropertyNames(err).forEach((key) => {
    plainObject[key] = err[key]
  })

  if (plainObject.message) callback(plainObject.message, null)
  callback(JSON.stringify(plainObject), null)
}
module.exports = sendError
