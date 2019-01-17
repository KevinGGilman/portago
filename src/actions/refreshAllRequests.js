export default function refreshAllRequests (isRefreshUser, globalCallback) {
  const { global } = this.props
  const listToMap = global.do.listToMap.bind(this)
  let stateAccumulator = { isLoading: false }
  let total = 0
  let count = 0

  const get = (url, req, callback) => {
    total++
    global.socket.emit(url, req, (err, result) => {
      count++
      if (err) return console.log(err)
      callback(result)
      if (count === total) {
        if (!stateAccumulator.group) stateAccumulator.modal = 'ChooseGroup'
        global.setState(stateAccumulator, () => {
          if (globalCallback) globalCallback(stateAccumulator)
        })
      }
    })
  }
  const preState = (state) => {
    stateAccumulator = { ...stateAccumulator, ...state }
  }

  if (isRefreshUser) get('users/self', {}, (obj) => preState({ user: obj }))
  get('groups/list', {}, (arr) => preState({ groupList: arr }))
  get('groups/details', {}, (obj) => preState({ group: obj }))
  get('logs/list', {}, (arr) => preState({ logList: arr }))
  get('comites/list', {}, (arr) => {
    const pinData = arr.reduce(({ pinList, pinMap }, comite) => (
      {
        pinList: [...pinList, ...comite.pinList],
        pinMap: { ...pinMap, ...comite.pinMap }
      }
    ), { pinList: [], pinMap: {} })
    const all = { _id: 'all', name: 'All Comites', ...pinData, index: 0 }
    preState({
      comiteList: [all, ...arr],
      comiteMap: listToMap(arr, { all })
    })
  })
}
