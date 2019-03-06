import React from 'react'
import { Pic } from '../Pic'
import { Button } from '../Form'
import paypal from '../../images/PayPal.svg'
import stripe from '../../images/Stripe.svg'
const typeList = [
  { label: 'pockets', list: 'selectedPocketList', key: 'pocket' },
  { label: 'straws', list: 'selectedStrawList', key: 'straw' },
  { label: 'brushes', list: 'selectedBrushList', key: 'brush' }
]
export const Cart = (props) => (
  <div className='cart'>
    <div className='cart-container'>
      <div className='scroll-view'>
        {typeList.map(({ label, list, key }, typeIndex) => (
          <React.Fragment key={typeIndex}>
            {!!props.global[list].length && <h4>{props.global.say[label]}:</h4>}
            {props.global[list].map((item, index) => (
              <Item
                key={index}
                global={props.global}
                item={item}
                price={props.global.config.cost[key]}
                onPlus={() => props.onPlus(item, index, list)}
                onMinus={() => props.onMinus(item, index, list)}
              />
            ))}
          </React.Fragment>
        ))}
        <h4>{`${props.global.say.shippingFees} :`}</h4>
        <div className='item'>
          <p />
          <p className='price'>{`${Number(props.global.config.cost.shipping)}$`}</p>
        </div>
      </div>
      <div className='payments'>
        <p>Pay with:</p>
        <span className='paypal'><img src={paypal} /></span>
        <span
          onClick={() => props.global.setState({ modal: 'StripeClient' })}
          className='stripe'
        >
          <img src={stripe} />
        </span>
        <p>
          {window.innerWidth > 470 && props.global.say.totalPrice}
          {window.innerWidth < 470 && props.global.say.price}
          {`${getTotalPrice(props)}$`}
        </p>
      </div>
    </div>
  </div>
)
function getTotalPrice (props) {
  const listPrice = typeList.reduce((price, { list, key }) => {
    props.global[list].forEach(({ buyCount }) => {
      price += props.global.config.cost[key] * buyCount
    })
    return price
  }, 0)
  return listPrice + props.global.config.cost.shipping
}
const Item = ({ item, type, global, price, onPlus, onMinus }) => (
  <div className='item'>
    <Pic global={global} image={item.imageList[0]} />
    <p>{item[global.lang].name}</p>
    <div className='bottom'>
      <Button faClass='far fa-minus' onClick={onMinus} />
      <span className='count'>{item.buyCount}</span>
      <Button faClass='far fa-plus' onClick={onPlus} />
    </div>
    <p className='price'>{`${price}$ x ${item.buyCount} = ${Number(price) * Number(item.buyCount)}$`}</p>
  </div>
)
