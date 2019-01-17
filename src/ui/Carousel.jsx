import React from 'react'
export default class Carousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = { index: 0 }
    this.goNextRecursive()
  }
  stop () {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), this.props.speed)
    })
  }
  async goNextRecursive () {
    const { length } = this.props.list
    let { index } = this.state
    await this.stop()
    index = index < length - 1 ? index + 1 : 0
    this.setState({ index }, this.goNextRecursive)
  }
  render () {
    const item = this.props.list[this.state.index]
    if (!item) {
      return (
        <div
          className='carousel'
          style={{ backgroundColor: 'hsl(0, 0%, 50%)' }}
        >
          <div className='container'>
            <i className='far fa-image' />
            <div className='text'>
              <h2>Ajouter une image</h2>
            </div>
          </div>
        </div>
      )
    }
    const { faIcon, faType, customIcon, title, paragraph, image } = item
    return (
      <div className='carousel' style={{ backgroundImage: `url('${image.url}')` }}>
        <i
          className='fas fa-left-arrow'
          onClick={() => this.setState({ index: this.state.index - 1 })}
        />
        {(faIcon || customIcon || title || paragraph) &&
          <div className='container'>
            {faIcon && <i
              className={`fa${faType.charAt(0).toLowerCase()} fa-${faIcon || ''}`}
            /> }
            {customIcon && <img src={customIcon} alt='custom icon' /> }
            <div className='text'>
              {title && <h1>{title}</h1>}
              {paragraph && <p>{paragraph}</p>}
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
