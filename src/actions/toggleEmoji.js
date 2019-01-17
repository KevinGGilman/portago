export default function toggleEmoji (emoji, obj, collection) {
  let { emojiList, emojiMap, _id } = obj
  emojiList = emojiList.slice()
  const me = this.props.global.user._id
  const index = emojiList.findIndex(obj => obj.emoji === emoji)
  let isRemoving = true
  if (emojiMap[emoji] && emojiMap[emoji][me]) {
    const userList = emojiList[index].userList.filter(_id => _id !== me)
    emojiList[index].userList = userList
    if (!userList.length) emojiList.splice(index, 1)
  } else {
    isRemoving = false
    if (!emojiMap[emoji]) emojiList.push({ emoji, userList: [me] })
    else emojiList[index].userList.push(me)
  }
  this.props.global.socket.emit(`${collection}/set/emojiList`,
    { emojiList, _id, emoji, isRemoving }, (err) => {
      if (err) console.log(err)
    })
}
