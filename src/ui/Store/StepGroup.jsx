import React from 'react'

export const StepGroup = (props) => (
  <div className='step-group'>
    {props.stepList.map(obj => (
      <div
        key={obj.label}
        onClick={() => props.global.history.push(obj.path)}
        className={`step-item ${
          obj.path === window.location.pathname ||
          (window.location.pathname.includes('pocket') && obj.path.includes('pocket'))
            ? 'active' : ''}`}
      >
        <span>{props.global.say[obj.label]}</span>
        <i className='far fa-angle-double-right' />
      </div>
    ))}
  </div>
)
