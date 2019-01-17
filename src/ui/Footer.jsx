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
      {config.facebook && <a href={config.facebook}><img src={facebook} /></a>}
      <a href={config.email}><img src={mail} /></a>
      <div />
      <a href={`tel:${config.phone}`}>
        <i className='fas fa-phone' /><h5>{config.phone}</h5>
      </a>
      <div />
      <Select
        value={props.global.say[props.global.lang]}
        onChange={(value) => props.global.setState({
          lang: value,
          say: value.includes('en') ? en : fr
        })}
        optionList={['en', 'fr']}
        outputList={[props.global.say.en, props.global.say.fr]}
      />
    </footer>
  )
}
