export default function setServerConnexion (newGlobal) {
  const { setState, socket, user, comiteList } = { ...this.props.global, ...newGlobal }
  socket.on(`${user._id}/logs/change`, (logList) => setState({ logList }))
  comiteList.forEach((obj, index) => {
    socket.on(`${obj._id}/pinList/change`, (pinData) => {
      const { comiteList, comiteMap } = this.props.global
      comiteList[index] = { ...comiteList[index], ...pinData }
      comiteMap[obj._id] = { ...comiteMap[obj._id], ...pinData }
      setState({ comiteList, comiteMap })
    })
  })
}
