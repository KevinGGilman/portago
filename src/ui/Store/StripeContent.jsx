import React from 'react'
import { Modal, Fieldset, Input, Output, Toggle, Button } from '../Form'
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from 'react-stripe-elements'
class Content extends React.Component {
  getTotalPrice () {
    const listPrice = this.props.typeList.reduce((price, { list, key }) => {
      this.props.global[list].forEach(({ buyCount }) => {
        price += this.props.global.config.cost[key] * buyCount
      })
      return price
    }, 0)
    return listPrice + this.props.global.config.cost.shipping
  }
  render () {
    const say = this.props.global.say
    return (
      <>
        <Modal.Body>
          <div className='group-set'>
            <h5>{say.paymentInfo}</h5>
            <div>
              <Fieldset faClass='fas fa-credit-card' label={say.cardNumber}>
                <CardNumberElement />
              </Fieldset>
              <Fieldset faClass='fas fa-calendar-alt' label={say.expiryDate}>
                <CardExpiryElement />
              </Fieldset>
              <Fieldset faClass='fas fa-shield-check' label={say.securityNumber}>
                <CardCVCElement />
              </Fieldset>
            </div>
          </div>
          <div className='group-set'>
            <h5>{say.shippingInfo}</h5>
            <div>
              <Fieldset faClass='fas fa-user-circle' label={say.fullName}>
                <Input
                  placeholder={say.fullNamePlaceholder}
                  value={this.props.shippingName}
                  onChange={(str) => this.props.setState({ shippingName: str })}
                />
              </Fieldset>
              <Fieldset faClass='fas fa-map-marker-alt' label={say.address}>
                <Input
                  placeholder={say.longAddressPlaceholder}
                  value={this.props.shippingAddress}
                  onChange={(str) => this.props.setState({ shippingAddress: str })}
                />
                <Input
                  className='postal-code'
                  placeholder={say.postalCodePlaceholder}
                  value={this.props.shippingPostalCode}
                  onChange={(str) => this.props.setState({ shippingPostalCode: str })}
                />
              </Fieldset>
              <Fieldset faClass='fas fa-map-marked-alt' label={say.region}>
                <Input
                  placeholder={say.cityPlaceholder}
                  value={this.props.shippingCity}
                  onChange={(str) => this.props.setState({ shippingCity: str })}
                />
                <Input
                  bottomList={province(this.props.global.lang)}
                  placeholder={say.provincePlaceholder}
                  value={this.props.shippingProvince}
                  onChange={(str) => this.props.setState({ shippingProvince: str })}
                />
                <Output value='Canada' />
              </Fieldset>
            </div>
          </div>
          <div className='group-set'>
            <h5>{say.billInfo}</h5>
            <div>
              <Fieldset faClass='fas fa-envelope' label={say.email}>
                <Input
                  placeholder={say.emailPlaceholder}
                  value={this.props.billEmail}
                  onChange={(str) => this.props.setState({ billEmail: str })}
                />
              </Fieldset>
              <Fieldset faClass='fas fa-thumbs-up' label={say.isSameInformations}>
                <Toggle
                  value={this.props.isSame}
                  onChange={(bool) => this.props.setState({ isSame: bool })}
                />
              </Fieldset>
              {!this.props.isSame &&
                <>
                  <Fieldset faClass='fas fa-user-circle' label={say.fullName}>
                    <Input
                      placeholder={say.fullNamePlaceholder}
                      value={this.props.billName}
                      onChange={(str) => this.props.setState({ billName: str })}
                    />
                  </Fieldset>
                  <Fieldset faClass='fas fa-map-marker-alt' label={say.address}>
                    <Input
                      placeholder={say.longAddressPlaceholder}
                      value={this.props.billAddress}
                      onChange={(str) => this.props.setState({ billAddress: str })}
                    />
                    <Input
                      className='postal-code'
                      placeholder={say.postalCodePlaceholder}
                      value={this.props.billPostalCode}
                      onChange={(str) => this.props.setState({ billPostalCode: str })}
                    />
                  </Fieldset>
                  <Fieldset faClass='fas fa-map-marked-alt' label={say.region}>
                    <Input
                      placeholder={say.cityPlaceholder}
                      value={this.props.billCity}
                      onChange={(str) => this.props.setState({ billCity: str })}
                    />
                    <Input
                      bottomList={province(this.props.global.lang)}
                      placeholder={say.provincePlaceholder}
                      value={this.props.billProvince}
                      onChange={(str) => this.props.setState({ billProvince: str })}
                    />
                    <Input
                      placeholder={say.countryPlaceholder}
                      value={this.props.billCountry}
                      onChange={(str) => this.props.setState({ billCountry: str })}
                    />
                  </Fieldset>
                </>
              }

            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.global.setState({ modal: '' })}>
            {this.props.global.say.back}
          </Button>
          <Button onClick={() => this.props.submit(this.props.stripe)}>
            {`${this.props.global.say.pay} ${this.getTotalPrice()} $`}
          </Button>
        </Modal.Footer>
      </>
    )
  }
}
const province = (lang) => (
  [
    { en: 'Alberta', fr: 'Alberta' },
    { en: 'British Columbia', fr: 'Colombie-Britannique' },
    { en: 'Manitoba', fr: 'Île-du-Prince-Édouard' },
    { en: 'New Brunswick', fr: 'Manitoba' },
    { en: 'Newfoundland and Labrador', fr: 'Nouveau-Brunswick' },
    { en: 'Northwest Territories', fr: 'Nouvelle-Écosse' },
    { en: 'Nova Scotia', fr: 'Nunavut' },
    { en: 'Nunavut', fr: 'Ontario' },
    { en: 'Ontario', fr: 'Québec' },
    { en: 'Prince Edward Island', fr: 'Saskatchewan' },
    { en: 'Quebec', fr: 'Terre-Neuve-et-Labrador' },
    { en: 'Saskatchewan', fr: 'Territoires du Nord-Ouest' },
    { en: 'Yukon', fr: 'Yukon' }
  ].map(obj => obj[lang])
)
export default injectStripe(Content)
