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
          <>
            {!!props.global[list].length && <h4>{props.global.say[label]}:</h4>}
            {props.global[list].map((item, index) => (
              <Item
                global={props.global}
                item={item}
                price={props.global.config.cost[key]}
                onPlus={() => props.onPlus(item, index, list)}
                onMinus={() => props.onMinus(item, index, list)}
              />
            ))}
          </>
        ))}
      </div>
      <div className='payments'>
        <p>Pay with:</p>
        <span className='paypal'><img src={paypal} /></span>
        <span className='stripe'><img src={stripe} /></span>
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
  return typeList.reduce((price, { list, key }) => {
    props.global[list].forEach(({ buyCount }) => {
      price += props.global.config.cost[key] * buyCount
    })
    return price
  }, 0)
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
