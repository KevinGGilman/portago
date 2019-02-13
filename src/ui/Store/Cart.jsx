import React from 'react'

export const Cart = (props) => {
  console.log(props.selectedPocketList)
  if (props.step !== 'cart') return null
  else {
    return (
      <div className='cart'>
        {props.selectedPocketList.map(pocket => (
          <div className='item'>
            {pocket.imageList[0] && <img src={pocket.imageList[0].url} />}
            <p>{pocket[props.global.lang].name}</p>
          </div>
        ))}
      </div>
    )
  }
}
