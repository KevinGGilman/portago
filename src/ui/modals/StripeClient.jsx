import React from 'react'
import { Modal, Button } from '../Form'
import StripeContent from '../Store/StripeContent'
import { Elements, StripeProvider } from 'react-stripe-elements'

const typeList = [
  { label: 'pockets', list: 'selectedPocketList', key: 'pocket' },
  { label: 'straws', list: 'selectedStrawList', key: 'straw' },
  { label: 'brushes', list: 'selectedBrushList', key: 'brush' }
]
export default class StripeClient extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      shippingName: '',
      shippingAddress: '',
      shippingPostalCode: '',
      shippingCity: '',
      shippingProvince: '',
      shippingCountry: 'Canada',
      isSame: true,
      billEmail: '',
      billName: '',
      billAddress: '',
      billPostalCode: '',
      billCity: '',
      billProvince: '',
      billCountry: ''
    }
  }
  getQuery (output, input) {
    return output.reduce((query, key, index) => {
      query[key] = this.state[input ? input[index] : key]
      return query
    }, {})
  }
  async submit (stripe) {
    let { token } = await stripe.createToken({ name: 'Name' })
    console.log(token)
    const shippingkeyList = [
      'shippingName', 'shippingAddress', 'shippingPostalCode', 'shippingCity',
      'shippingProvince'
    ]
    const billKeyList = [
      'billName', 'billAddress', 'billPostalCode', 'billCity', 'billProvince', 'billCountry'
    ]
    const outputKeyList = [
      'name', 'address', 'postalCode', 'city', 'province', 'country'
    ]
    const query = {
      token: token.id,
      articleList: this.getArticleList(),
      shipping: this.getQuery(outputKeyList, shippingkeyList),
      bill: {
        ...this.getQuery(outputKeyList, this.state.isSame ? shippingkeyList : billKeyList),
        email: this.state.billEmail,
        country: this.state.isSame ? 'Canada' : this.state.billCountry
      },
      lang: this.props.global.lang
    }
    this.props.global.socket.emit('payments/insert', query, (err) => {
      if (err) console.log(err)
    })
  }

  getArticleList () {
    return typeList.reduce((articleList, { list }) => {
      this.props.global[list].forEach(({ _id, buyCount }) => {
        articleList.push({ _id, buyCount })
      })
      return articleList
    }, [])
  }
  render () {
    return (
      <Modal id='payment' closeModal={() => this.props.global.setState({ modal: '' })}>
        <StripeProvider apiKey='pk_test_TYooMQauvdEDq54NiTphI7jx'>
          <Elements fonts={[{ family: 'sans-serif', weight: '100' }]}>
            <StripeContent
              global={this.props.global}
              setState={(obj) => this.setState(obj)}
              submit={(stripe) => this.submit(stripe)}
              typeList={typeList}
              {...this.state}
            />
          </Elements>
        </StripeProvider>
      </Modal>
    )
  }
}
