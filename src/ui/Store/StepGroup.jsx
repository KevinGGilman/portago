import React from 'react'

export const StepGroup = (props) => (
  <div className='step-group'>
    {props.stepList.map((obj, index) => (
      <>
        <div
          key={index}
          onClick={() => props.global.history.push(obj.path)}
          className={`step-item ${
            obj.path === window.location.pathname ||
          (window.location.pathname.includes('pocket') && obj.path.includes('pocket'))
              ? 'active' : ''}`}
        >
          <span>{props.global.say[obj.label]}</span>
        </div>
        <i className='far fa-angle-double-right' />
      </>
    ))}
  </div>
)
