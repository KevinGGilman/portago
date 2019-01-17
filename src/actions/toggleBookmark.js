export default function toggleBookmark (bookmark) {
  let { user } = this.props.global
  let { bookmarkList, bookmarkMap } = user
  if (bookmarkMap[bookmark._id]) {
    bookmarkList = bookmarkList.map(obj => obj._id).filter((_id) => _id !== bookmark._id)
    delete bookmarkMap[bookmark._id]
  } else {
    bookmarkList.push(bookmark)
    bookmarkMap[bookmark._id] = bookmark
  }
  user = { ...user, bookmarkList, bookmarkMap }
  this.props.global.setState({ user })
  this.props.global.socket.emit('users/update', {
    bookmarkList: bookmarkList.map(obj => obj._id)
  }, (err) => {
    if (err) console.log(err)
  })
}
