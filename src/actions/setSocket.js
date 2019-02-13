import io from 'socket.io-client'
import actions from '../actions'
export default function setSocket (isDev) {
  let { session } = actions.getJSONFromCookie()
  const dataToServer = { query: { session } }
  const port = isDev ? 'http://127.0.0.1:8080' : window.location.hostname
  return io(port, dataToServer)
}
