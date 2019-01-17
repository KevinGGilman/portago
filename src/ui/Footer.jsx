import React from 'react'
import facebook from '../images/facebook.svg'
import mail from '../images/mail.svg'
export const Footer = (props) => {
  const { config } = props.global
  return (
    <footer>
      {config.facebook && <a href={config.facebook}><img src={facebook} /></a>}
      <a href={config.email}><img src={mail} /></a>
      <div />
      <a href={`tel:${config.phone}`}>
        <i className='fas fa-phone' /><h5>{config.phone}</h5>
      </a>
    </footer>
  )
}
