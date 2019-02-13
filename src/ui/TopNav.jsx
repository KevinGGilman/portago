import React from 'react'
import logo from '../images/logo.svg'
import { Link } from 'react-router-dom'
export const TopNav = (props) => (
  <nav id='top-nav'>
    <img src={logo} alt='logo' />
    <div>
      <Link to='/'>
        <i className='fas fa-home' /><span>{props.global.say.home}</span>
      </Link>
      <Link to='/store'>
        <i className='fas fa-store' /><span>{props.global.say.store}</span>
      </Link>
      {props.global.locationList.length > 0 &&
        <Link to='/maps'>
          <i className='fas fa-map-pin' />
          <span>{props.global.say.salePoints}</span>
        </Link>
      }
      <Link to='/about'>
        <i className='fas fa-info-circle' /><span>{props.global.say.about}</span>
      </Link>
    </div>
  </nav>
)
