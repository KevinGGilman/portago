import React from 'react'
import ReactDOM from 'react-dom'
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
    const socket = actions.setSocket(actions.isDev())
    const lang = navigator.language || navigator.userLanguage
    this.state = {
      socket,
      config,
      isLoading: true,
      do: actions,
      locationList: [],
      carousel: [],
      postList: [],
      pocketList: [],
      strawList: [],
      brushList: [],
      categoryList: [],
      user: undefined,
      lang: lang.includes('en') ? 'en' : 'fr',
      say: lang.includes('en') ? en : fr,
      ...actions.getLocalData(),
      setState: (state, callback) => this.setState(state, callback && callback())
    }
    this.refresh = actions.refreshAllRequests.bind(this)
    this.onChange = actions.onChange.bind(this)
    window.addEventListener('dragover', (evt) => evt.preventDefault())
    window.addEventListener('drop', (evt) => evt.preventDefault())
    window.addEventListener('resize', () => this.forceUpdate())
    socket.on('users/self', (user) => {
      if (!user) this.setState({ user: null })
      else this.setState({ user: user })
      this.refresh()
    })
    this.onChange([
      { key: 'carousel', url: 'carousel/list' },
      { key: 'locationList', url: 'locations/list' },
      { key: 'postList', url: 'posts/list' },
      { key: 'pocketList', url: 'articles/list' },
      { key: 'strawList', url: 'articles/list' },
      { key: 'brushList', url: 'articles/list' },
      { key: 'categoryList', url: 'categories/list' }
    ])
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
