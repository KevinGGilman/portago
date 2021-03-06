import React from 'react'
import logo from '../images/logo.svg'
import p from '../images/p.svg'
import { Link } from 'react-router-dom'
export const TopNav = (props) => (
  <nav id='top-nav'>
    {window.innerWidth > 760 && <img src={logo} alt='logo' />}
    <div>
      {window.innerWidth <= 760 && <img src={p} alt='logo' />}
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
      {!!getCartLength(props.global) &&
        <Link to='/store/cart' className='cart-icon'>
          <i className='fas fa-shopping-cart' /><span>{getCartLength(props.global)}</span>
        </Link>
      }

    </div>
  </nav>
)
function getCartLength (global) {
  return global.selectedPocketList.length +
  global.selectedStrawList.length +
  global.selectedBrushList.length
}
