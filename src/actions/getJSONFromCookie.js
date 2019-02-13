// convert an array to a _id mapping
export default function getJSONFromCookie () {
  return document.cookie.split(';').reduce((json, cookie) => {
    const [key, value] = cookie.split('=')
    if (!key) return json
    json[key.trim()] = value.trim()
    return json
  }, {})
}
