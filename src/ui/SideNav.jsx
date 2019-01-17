import React from 'react'
import { Link } from 'react-router-dom'
export const SideNav = (props) => (
  <nav id='side-nav'>
    <h3>{props.global.say.settings}<i className='far fa-cogs' /></h3>
    <a
      href={window.location.origin}
      onClick={() => props.global.socket.emit('users/logout')}
    >
      <i className='fas fa-sign-out' />{props.global.say.logout}
    </a>
    <a target='_blank' href={window.location.origin}>
      <i className='fas fa-eye' />{props.global.say.preview}
    </a>
    <Link to='/settings/carousel'>
      <i className='fas fa-images' />{props.global.say.carousel}
    </Link>
  </nav>
)
