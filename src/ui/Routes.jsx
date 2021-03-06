import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { TopNav } from './TopNav'
import { SideNav } from './SideNav'
import MapsTool from './tools/Maps'
import CarouselTool from './tools/Carousel'
import AboutTool from './tools/About'
import ArticlesTool from './tools/Articles'
import CategoriesTool from './tools/Categories'
import Maps from './pages/Maps'
import Store from './Store/Store'
import Carousel from './pages/Carousel'
import About from './pages/About'
import Login from './pages/Login'
import { NotFound } from './pages/NotFound'
import { Footer } from './Footer'
import modalMap from './modals'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    rest.global.user
      ? <Component {...props} {...rest} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  )} />
)
const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    !rest.global.user
      ? <Component {...props} {...rest} />
      : <Redirect to={{ pathname: '/settings', state: { from: props.location } }} />
  )} />
)
export class Routes extends React.Component {
  render () {
    const global = { ...this.props.global, history: this.props.history }
    const ActiveModal = modalMap[global.modal]
    const isLogin = window.location.pathname.includes('login')
    const isSettings = window.location.pathname.includes('setting')
    const isTool = window.location.pathname.includes('settings')
    if (this.props.global.user === undefined || (this.props.isLoading && isTool)) {
      return (
        <div className='carousel'>
          <div className='container'>
            <i className='far fa-spinner' />
            <div className='text'>
              <h2>{this.props.global.say.loading}</h2>
            </div>
          </div>
        </div>
      )
    }
    return (
      <React.Fragment>
        {ActiveModal && <ActiveModal global={global} {...global.modalProps} />}
        {!isSettings && !isLogin && <TopNav global={global} />}
        {global.user && isSettings && <SideNav global={global} />}
        {global.isHoverLoading && isTool && <div className='loading'><i className='far fa-spinner' /></div>}
        <Switch>
          <PublicRoute path='/login' component={Login} global={global} />
          <PrivateRoute path='/settings/carousel' component={CarouselTool} global={global} />
          <PrivateRoute path='/settings/maps' component={MapsTool} global={global} />
          <PrivateRoute path='/settings/about' component={AboutTool} global={global} />
          <PrivateRoute path='/settings/categories' component={CategoriesTool} global={global} />
          <PrivateRoute path='/settings/pockets' type='pocket' component={ArticlesTool} global={global} />
          <PrivateRoute path='/settings/straws' type='straw' component={ArticlesTool} global={global} />
          <PrivateRoute path='/settings/brushes' type='brush' component={ArticlesTool} global={global} />
          <Route exact path='/' render={() => (
            <Carousel
              list={global.carousel}
              speed={global.config.speed}
              global={global}
            />
          )} />
          <Route path='/maps' render={() => <Maps global={global} />} />
          <Route path='/about' render={() => <About global={global} />} />
          <Route path='/store' render={() => <Store global={global} />} />
          <Route path='/notFound' render={() => <NotFound global={global} />} />
          <PrivateRoute path='/settings' component={() => null} global={global} />
          <Redirect to='/notFound' />
        </Switch>
        {!isSettings && !isLogin && <Footer global={global} />}
      </React.Fragment>
    )
  }
}
