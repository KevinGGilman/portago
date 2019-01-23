import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import { BrowserRouter, Route } from 'react-router-dom'
import { Routes } from './ui/Routes'
import actions from './actions'
import './styles/main.scss'
import { fr } from './text/fr'
import { en } from './text/en'
import { config } from './text/config'
class App extends React.Component {
  constructor (props) {
    super(props)
    const isDev = actions.isDev()
    const socket = actions.setSocket(isDev)
    const lang = navigator.language || navigator.userLanguage
    this.state = {
      socket,
      config,
      do: actions,
      carousel: [],
      locationList: [],
      postList: [],
      pocketList: [],
      strawList: [],
      brushList: [],
      categoryList: [],
      user: undefined,
      lang: lang.includes('en') ? 'en' : 'fr',
      say: lang.includes('en') ? en : fr,
      setState: (state, callback) => this.setState(state, callback && callback())
    }

    window.addEventListener('dragover', (evt) => evt.preventDefault())
    window.addEventListener('drop', (evt) => evt.preventDefault())
    window.addEventListener('resize', () => this.forceUpdate())
    socket.emit('users/self', { date: new Date() }, (err, result) => {
      if (err) this.setState({ user: null })
      else {
        this.setState({ user: result })
      }
    })
    socket.emit('carousel/list', {}, (err, result) => {
      if (err) return
      this.setState({ carousel: result })
    })
    socket.emit('locations/list', {}, (err, result) => {
      if (err) return
      this.setState({ locationList: result })
    })
    socket.emit('posts/list', {}, (err, result) => {
      if (err) return
      this.setState({ postList: result })
    })
    socket.emit('articles/list', { type: 'pocket' }, (err, result) => {
      if (err) return
      this.setState({ pocketList: result })
    })
    socket.emit('articles/list', { type: 'straw' }, (err, result) => {
      if (err) return
      this.setState({ strawList: result })
    })
    socket.emit('articles/list', { type: 'brush' }, (err, result) => {
      if (err) return
      this.setState({ brushList: result })
    })
    socket.emit('categories/list', {}, (err, result) => {
      if (err) return
      this.setState({ categoryList: result, categoryMap: actions.listToMap(result) })
    })
  }
  render () {
    return (
      <BrowserRouter>
        <Route path='/' render={(props) =>
          <Routes global={this.state} {...props} />
        } />
      </BrowserRouter>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('render-target'))
