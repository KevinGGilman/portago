import React from 'react'
export class Pic extends React.Component {
  constructor (props) {
    super(props)
    this.state = { image: props.image }
    this.getImage = this.getImage.bind(this)
    if (typeof props.image !== 'object' && props.image) this.getImage(props.image)
  }
  getImage (_id) {
    this.props.global.socket.emit('files/url/short', { _id }, (err, result) => {
      if (err) console.log(err)
      this.setState({ image: { url: result, _id } })
    })
  }
  render () {
    const props = this.props
    return (
      <div
        className={`pic ${props.className || ''}`}
        style={{ backgroundImage: `url(${(this.state.image || {}).url})` }}
        onClick={() => props.onClick && props.onClick()}
      >
        {props.count && <div className='count'>+{props.count - 1}</div>}
        {props.onClick && <div><i className='fas fa-camera' /></div>}
        {props.children && <div>{props.children}</div>}
      </div>
    )
  }
}
