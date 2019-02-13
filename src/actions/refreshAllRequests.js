export default function refreshAllRequests (isRefreshUser, globalCallback) {
  const global = this.props.global || this.state

  const get = (url, req, callback) => {
    global.socket.emit(url, req, (err, result) => {
      if (err) return console.log(err)
      callback(result)
    })
  }
  const setState = (state) => global.setState(state)

  if (isRefreshUser) get('users/self', {}, (obj) => setState({ user: obj }))
  get('carousel/list', {}, (arr) => setState({ carousel: arr }))
  get('locations/list', {}, (arr) => setState({ locationList: arr }))
  get('posts/list', {}, (arr) => setState({ postList: arr }))
  get('articles/list', { type: 'pocket' }, (arr) => setState({ pocketList: arr }))
  get('articles/list', { type: 'straw' }, (arr) => setState({ strawList: arr }))
  get('articles/list', { type: 'brush' }, (arr) => setState({ brushList: arr }))
  get('categories/list', {}, (arr) => setState({
    categoryList: arr,
    categoryMap: global.do.listToMap(arr)
  }))
}
