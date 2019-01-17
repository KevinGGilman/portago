export default function togglePin (target, collection) {
  let { comite, comiteMap } = this.props.global
  let isRemoving = true
  if (!comiteMap[comite].pinMap[target._id]) isRemoving = false

  this.props.global.socket.emit('comites/set/pinList', {
    group: target.group,
    comite: target.comite,
    _id: target._id,
    collection,
    isRemoving
  }, (err) => {
    if (err) console.log(err)
  })
}
