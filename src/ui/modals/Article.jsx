import React from 'react'
import { Modal, Button, Label, Fieldset, Select } from '../Form'
import ImageGalery from '../ImageGalery'
export default class AddComiteModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  add () {

  }
  render () {
    console.log(this.props)
    return (
      <Modal
        closeModal={() => this.props.global.setState({ modal: '' })}
      >
        <Modal.Header title='Article'></Modal.Header>
        <Modal.Body>
          <Fieldset label={this.props.global.say.productName}>
            <Label>{this.props[this.props.global.lang].name}</Label>
          </Fieldset>
          <Fieldset label={this.props.global.say.productDescription}>
            <Label>{this.props[this.props.global.lang].description}</Label>
          </Fieldset>
          <Fieldset label={this.props.global.say.quantity}>
            <Label>{this.props.count}</Label>
          </Fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => this.props.global.setState({ modal: '' })}
          >
            {this.props.global.say.back}</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
