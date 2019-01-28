import React from 'react'
import { Link } from 'react-router-dom'
export const SideNav = (props) => (
  <nav id='side-nav'>
    <h3>{props.global.say.settings}<i className='far fa-cogs' /></h3>
    <a
      href={window.location.origin}
      onClick={() => props.global.socket.emit('users/logout')}
      alt='logout'
    >
      <i className='fas fa-sign-out' />{props.global.say.logout}
    </a>
    <a target='_blank' rel='noopener noreferrer' href={window.location.origin}>
      <i className='fas fa-eye' />{props.global.say.preview}
    </a>
    <Link to='/settings/carousel'>
      <i className='fas fa-images' />{props.global.say.carousel}
    </Link>
    <Link to='/settings/maps'>
      <i className='fas fa-map-pin' />{props.global.say.salePoints}
    </Link>
    <Link to='/settings/about'>
      <i className='fas fa-info-circle' />{props.global.say.about}
    </Link>
    <Link to='/settings/categories'>
      <i className='fas fa-books' />{props.global.say.categories}
    </Link>
    <Link to='/settings/pockets'>
      <i className='fas fa-tags' />{props.global.say.pocket + 's'}
    </Link>
    <Link to='/settings/straws'>
      <i className='fas fa-tags' />{props.global.say.straw + 's'}
    </Link>
    <Link to='/settings/brushes'>
      <i className='fas fa-tags' />{props.global.say.brush}
    </Link>
  </nav>
)
