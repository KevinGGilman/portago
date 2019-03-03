import React from 'react'
import facebook from '../images/facebook.svg'
import mail from '../images/mail.svg'
import { Select } from './Form'
import { fr } from '../text/fr'
import { en } from '../text/en'
export const Footer = (props) => {
  const { config } = props.global
  return (
    <footer>
      <div className='footer-container'>
        {config.facebook && <a href={config.facebook}><img src={facebook} alt='facebook' /></a>}
        <a href={config.email}><img src={mail} alt='email' /></a>
        <div />
        <a href={`tel:${config.phone}`}>
          <i className='fas fa-phone' /><h5>{config.phone}</h5>
        </a>
        <div />
        <Select
          value={props.global.lang.charAt(0).toUpperCase() + props.global.lang.charAt(1)}
          onChange={(value) => props.global.setState({
            lang: value,
            say: value.includes('en') ? en : fr
          })}
          optionList={['en', 'fr']}
          outputList={[props.global.say.en, props.global.say.fr]}
        />
      </div>
    </footer>
  )
}
