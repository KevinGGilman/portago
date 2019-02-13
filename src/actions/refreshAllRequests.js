export default function refreshAllRequests (isRefreshUser, globalCallback) {
  const global = this.props.global || this.state
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
        global.setState(stateAccumulator, () => {
          if (globalCallback) globalCallback(stateAccumulator)
        })
      }
    })
  }
  const preState = (state) => {
    stateAccumulator = { ...stateAccumulator, ...state }
    Object.keys(state).forEach(key => {
      window.localStorage.setItem(key, JSON.stringify(state[key]))
    })
  }

  if (isRefreshUser) get('users/self', {}, (obj) => preState({ user: obj }))

  get('carousel/list', {}, (arr) => preState({ carousel: arr }))
  get('locations/list', {}, (arr) => preState({ locationList: arr }))
  get('posts/list', {}, (arr) => preState({ postList: arr }))
  get('articles/list', { type: 'pocket' }, (arr) => preState({ pocketList: arr }))
  get('articles/list', { type: 'straw' }, (arr) => preState({ strawList: arr }))
  get('articles/list', { type: 'brush' }, (arr) => preState({ brushList: arr }))
  get('categories/list', {}, (arr) => preState({
    categoryList: arr,
    categoryMap: global.do.listToMap(arr)
  }))
}
