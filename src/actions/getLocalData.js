export default function getLocalData (keyList) {
  return keyList.reduce((dict, key) => {
    const stringValue = window.localStorage.getItem(key)
    if (stringValue) {
      try {
        dict[key] = JSON.parse(stringValue)
      } catch (err) {
        dict[key] = []
      }
    } else {
      dict[key] = []
    }
    return dict
  }, {})
}
