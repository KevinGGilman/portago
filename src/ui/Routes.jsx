import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { TopNav } from './TopNav'
import { SideNav } from './SideNav'
import Carousel from './Carousel'
import CarouselTool from './tools/Carousel'
import Login from './Login'
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
    return (
      <React.Fragment>
        {ActiveModal && <ActiveModal global={global} {...global.modalProps} />}
        {!isSettings && !isLogin && <TopNav global={global} />}
        {global.user && isSettings && <SideNav global={global} />}
        <Switch>
          <PublicRoute path='/login' component={Login} global={global} />
          <PrivateRoute path='/settings/carousel' component={CarouselTool} global={global} />
          <Route exact path='/' render={() => (
            <Carousel
              list={global.carousel}
              speed={global.config.speed}
              global={global}
            />
          )} />
        </Switch>
        {!isSettings && !isLogin && <Footer global={global} />}
      </React.Fragment>
    )
  }
}
