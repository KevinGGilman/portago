export default function onChange (keyList) {
  const global = this.props.global || this.state
  keyList.forEach(obj => {
    global.socket.on(obj.url, () => {
      const query = {}
      if (obj.url.includes('articles')) query.type = obj.key.split('L')[0]
      global.socket.emit(obj.url, query, (err, result) => {
        console.log(result)
        if (err) console.log(err)
        global.setState({ [obj.key]: result })
      })
    })
  })
}
