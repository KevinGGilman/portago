export default function getLocalData (keyList, listToMap) {
  return keyList.reduce((dict, key) => {
    const stringValue = window.localStorage.getItem(key)
    if (stringValue) {
      try {
        dict[key] = JSON.parse(stringValue)
        if (key === 'categoryList') dict.categoryMap = listToMap(dict[key])
      } catch (err) {
        dict[key] = []
        if (key === 'categoryList') dict.categoryMap = {}
      }
    } else {
      dict[key] = []
    }
    return dict
  }, {})
}
