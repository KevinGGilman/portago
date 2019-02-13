import React from 'react'
export default class Carousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = { index: 0 }
    this.goNextRecursive()
    this.stop = false
  }
  stop (speed) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), speed)
    })
  }
  async goNextRecursive () {
    const { length } = this.props.list
    if (!length || this.stop) return
    let { index } = this.state
    await this.stop(this.props.speed)
    index = index < length - 1 ? index + 1 : 0
    this.setState({ index }, this.goNextRecursive)
  }
  componentWillUnmount () {
    this.stop = true
  }
  render () {
    const item = this.props.list[this.state.index]
    if (!item) {
      return (
        <div className='carousel'>
          <div className='container'>
            <i className='far fa-spinner' />
            <div className='text'>
              <h2>{this.props.global.say.loading}</h2>
            </div>
          </div>
        </div>
      )
    }
    const { faIcon, faType, customIcon, image } = item
    const { lang } = this.props.global
    return (
      <div className='carousel' style={{ backgroundImage: `url('${image.url}')` }}>
        <i
          className='fas fa-left-arrow'
          onClick={() => this.setState({ index: this.state.index - 1 })}
        />
        {(faIcon || customIcon || item[lang].title || item[lang].description) &&
          <div className='container'>
            {faIcon && <i
              className={`fa${faType.charAt(0).toLowerCase()} fa-${faIcon || ''}`}
            /> }
            {customIcon && <img src={customIcon} alt='custom icon' /> }
            <div className='text'>
              {item[lang].title && <h1>{item[lang].title}</h1>}
              {item[lang].description && <p>{item[lang].description}</p>}
            </div>
          </div>
        }
        <i
          className='fas fa-right-arrow'
          onClick={() => this.setState({ index: this.state.index + 1 })}
        />
      </div>
    )
  }
}
