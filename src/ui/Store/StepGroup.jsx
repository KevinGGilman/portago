import React from 'react'
import { Button } from '../Form'

export const StepGroup = (props) => (
  <div className='step-group'>
    {props.stepList.indexOf(props.value) !== 0 &&
    <Button onClick={() => props.onBack(getStep(props, -1))}>
      {props.global.say.back}
    </Button>
    }
    {/* <span className='step-type'>{props.global.say[props.type] + ' :'}</span> */}
    {props.stepList.map((key) => (
      <div className={`step-item ${key === props.value ? 'active' : ''}`}>
        <span>{props.global.say[key]}</span>
        <i className='far fa-angle-double-right' />
      </div>
    ))}
    <Button onClick={() => props.onSkip(getStep(props, 1))}>{props.global.say.next}</Button>
  </div>
)
const getStep = (props, incrementation) => {
  const index = props.stepList.indexOf(props.value)
  return props.stepList[index + incrementation]
}
