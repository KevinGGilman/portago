import React from 'react'
export const Pic = (props) => {
  return (
    <div
      className={`pic ${props.className || ''}`}
      style={{ backgroundImage: `url(${props.image})` }}
      onClick={() => props.onClick && props.onClick()}
    >
      {props.count && <div className='count'>+{props.count - 1}</div>}
      {props.onClick && <div><i className='fas fa-camera' /></div>}
      {props.children && <div>{props.children}</div>}
    </div>
  )
}
