function sendJSON (callback, json) {
  if (callback) callback(null, json)
}
module.exports = sendJSON
