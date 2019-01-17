import React from 'react'
import { Fieldset, Input, Button } from './Form'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { email: '', password: '' }
  }
  login () {
    this.props.global.socket.emit('users/login', {
      email: this.state.email,
      password: this.state.password
    }, (err, result) => {
      if (err) console.log(err)
      else {
        document.cookie = `session=${result._id}`
        window.location.reload(false)
      }
    })
  }
  render () {
    return (
      <div id='login'>
        <div>
          <Fieldset isValidation={this.state.isValidation} label='Email :'>
            <Input
              type='email'
              value={this.state.email}
              placeholder='example@example.com'
              onChange={(value) => this.setState({ email: value })}
            />
          </Fieldset>
          <Fieldset isValidation={this.state.isValidation} label='password :'>
            <Input
              type='password'
              value={this.state.password}
              placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;'
              onChange={(value) => this.setState({ password: value })}
            />
          </Fieldset>
          <Button onClick={this.login.bind(this)}>Login</Button>
        </div>
      </div>
    )
  }
}
