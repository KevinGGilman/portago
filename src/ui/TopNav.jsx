import React from 'react'
import logo from '../images/logo.svg'
import { Link } from 'react-router-dom'
export const TopNav = (props) => (
  <nav id='top-nav'>
    <img src={logo} />
    <div>
      <Link to='/'>
        <i className='fas fa-home' />{props.global.say.home}
      </Link>
      <Link to='/store'>
        <i className='fas fa-store' />{props.global.say.store}
      </Link>
      <Link to='/salesPoints'>
        <i className='fas fa-map-pin' />{props.global.say.salePoints}
      </Link>
      <Link to='/about'>
        <i className='fas fa-info-circle' />{props.global.say.about}
      </Link>
    </div>
  </nav>
)
