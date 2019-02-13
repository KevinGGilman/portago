import React from 'react'

export const StepGroup = (props) => (
  <div className='step-group'>
    {props.stepList.map((key) => (
      <div
        key={key}
        onClick={() => props.onChange(key)}
        className={`step-item ${key === props.value ? 'active' : ''}`}
      >
        <span>{props.global.say[key]}</span>
        <i className='far fa-angle-double-right' />
      </div>
    ))}
  </div>
)
