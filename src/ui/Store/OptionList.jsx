import React from 'react'
import { Pic } from '../Pic'
import { Button } from '../Form'
import listToMap from '../../actions/listToMap'
export const OptionList = (props) => {
  const selectedMap = props.selectedList && listToMap(props.selectedList)
  return (
    <div className='list'>
      {props.list.map(item => {
        const selectedItem = (selectedMap || {})[item._id]
        const buyCount = selectedItem ? selectedMap[item._id].buyCount : 0
        return (
          <div
            key={item._id}
            className='item'
            onClick={() => props.onClick(item)}
          >
            <Pic
              global={props.global}
              image={(item.image || ((item.imageList || [])[0]) || {})}>
              {props.title && <p>{props.title(item)}</p>}
              {props.badge && <span>{props.badge(item)}</span>}
            </Pic>
            {selectedMap &&
            <div className='bottom'>
              <Button
                faClass='far fa-minus'
                onClick={(evt) => onMinus(evt, props, item, selectedItem, buyCount)}

              />
              <span>{buyCount}</span>
              <Button
                faClass='far fa-plus'
                onClick={(evt) => onPlus(evt, props, item, selectedItem, buyCount)}
              />
            </div>
            }
          </div>
        )
      })}
    </div>
  )
}
const onPlus = (evt, props, item, selectedItem, buyCount) => {
  evt.stopPropagation()
  if (Number(buyCount) < Number(item.count)) {
    props.onPlus(item, (selectedItem || {}).index)
  }
}
const onMinus = (evt, props, item, selectedItem, buyCount) => {
  evt.stopPropagation()
  if (Number(buyCount) > 0) props.onMinus(item, selectedItem.index)
}
