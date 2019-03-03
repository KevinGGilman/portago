export default function getLocalData () {
  const data = {
    selectedPocketList: [],
    selectedStrawList: [],
    selectedBrushList: []
  }
  Object.keys(data).forEach(key => {
    const item = window.localStorage.getItem(key)
    if (!item) return
    try { data[key] = JSON.parse(item) } catch (err) {}
  })
  return data
}
