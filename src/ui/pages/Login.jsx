import React from 'react'
import { Fieldset, Input, Button } from '../Form'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = { email: '', password: '' }
    this.login = this.login.bind(this)
  }
  login () {
    this.props.global.socket.emit('users/login', {
      email: this.state.email,
      password: this.state.password
    }, (err, result) => {
      if (err) console.log(err)
      else {
        document.cookie = `session=${result._id};path=/;`
        window.location.reload(false)
      }
    })
  }
  render () {
    return (
      <div
        id='login'
        onKeyUp={evt => evt.key === 'Enter' && this.login()}
      >
        <div>
          <form>
            <Fieldset isValidation={this.state.isValidation} label='Email :'>
              <Input
                autoComplete='user-name'
                type='email'
                value={this.state.email}
                placeholder='example@example.com'
                onChange={(value) => this.setState({ email: value })}
              />
            </Fieldset>
            <Fieldset isValidation={this.state.isValidation} label='password :'>
              <Input
                autoComplete='current-password'
                type='password'
                value={this.state.password}
                placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;'
                onChange={(value) => this.setState({ password: value })}
              />
            </Fieldset>
            <Button onClick={this.login}>Login</Button>
          </form>
        </div>
      </div>
    )
  }
}
