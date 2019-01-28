export default function onChange (keyList) {
  const global = this.props.global || this.state
  keyList.forEach(obj => {
    global.socket.on(obj.url, () => {
      global.socket.emit(obj.url, {}, (err, result) => {
        if (err) console.log(err)
        global.setState({ [obj.key]: result })
        window.localStorage.setItem(obj.key, JSON.stringify(result))
      })
    })
  })
}
