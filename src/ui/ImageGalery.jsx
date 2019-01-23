import React from 'react'
import ReactDOM from 'react-dom'
export default class ImageGalery extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      height: '',
      index: 0,
      isFullscreen: false
    }
    this.Fullscreen = Fullscreen.bind(this)
  }
  componentDidMount () {
    this.getGaleryHeight()
  }
  getGaleryHeight () {
    this.galeryNode = ReactDOM.findDOMNode(this.galeryRef)
    if (!this.galeryNode) return
    this.setState({ height: this.galeryNode.clientWidth + 'px' })
  }

  renderList (length, from, isMore) {
    return (
      <>
        {[...Array(length)].map((v, index) => (
          <div
            key={index}
            ref={(ref) => { this[`img${index}`] = ref }}
            onClick={() => this.setState({
              isFullscreen: true,
              index: index + from
            })}
            style={{
              backgroundImage: `url('${this.props.list[index + from].url}')`,
              maxWidth: this.props.list[index + from].width + 'px',
              maxHeight: this.props.list[index + from].height + 'px'
            }}>
            {(isMore && index === length - 1) &&
              <div>+{this.props.list.length - 5}</div>
            }
          </div>
        ))}
      </>
    )
  }
  back (evt) {
    evt.stopPropagation()
    let index = this.state.index - 1
    if (index === -1) index = this.props.list.length - 1
    this.setState({ index })
  }
  getMin () {
    return this.props.list.reduce((min, obj) => {
      if (min.width > obj.width) min.width = obj.width
      if (min.height > obj.height) min.height = obj.height
      return min
    }, { width: Infinity, height: Infinity })
  }
  render () {
    const { list: li } = this.props
    if (!li.length) return null
    const { width, height } = this.getMin()
    const mainProps = {
      ref: (ref) => { this.galeryRef = ref },
      style: { height: this.state.height }
    }
    if (width < 250 || height < 250) {
      return (
        <div className='image-galery simple'>
          {[...Array(li.length <= 4 ? li.length : 4)].map((v, index) => (
            <img
              onClick={() => this.setState({ isFullscreen: true, index: index })}
              key={this.props.list[index]._id}
              src={this.props.list[index].url}
              alt={this.props.list[index].name.split('.')[0]} />
          ))}
          {li.length === 5 && <img src={this.props.list[5].url} alt={this.props.list[5].name.split('.')[0]} />}
          {li.length > 5 &&
            <div
              className='more'
              style={{ backgroundImage: `url('${this.props.list[5].url}')` }}
              onClick={() => this.setState({ isFullscreen: true, index: 5 })}
            >
              <div>+{li.length - 5}</div>
            </div>
          }
          {this.state.isFullscreen && <this.Fullscreen />}
        </div>
      )
    }
    if (this.props.list.length === 1) {
      return (
        <div className='one-image'>
          <img
            onClick={() => this.setState({
              isFullscreen: true,
              index: 0
            })}
            src={this.props.list[0].url}
            alt={this.props.list[0].name.split('.')[0]}
            style={{ maxWidth: width }}
          />
          {this.state.isFullscreen && <this.Fullscreen />}
        </div>
      )
    } else if (this.props.list.length === 2) {
      if (li[0].width < li[0].height && li[1].width < li[1].height) {
        return (
          <div className='image-galery' {...mainProps}>
            <div>{this.renderList(1, 0)}</div>
            <div>{this.renderList(1, 1)}</div>
            {this.state.isFullscreen && <this.Fullscreen />}
          </div>
        )
      } else {
        return (
          <div className='image-galery' {...mainProps}>
            <div>{this.renderList(2, 0)}</div>
            {this.state.isFullscreen && <this.Fullscreen />}
          </div>
        )
      }
    } else if (this.props.list.length === 3) {
      return (
        <div className='image-galery' {...mainProps}>
          <div>{this.renderList(1, 0)}</div>
          <div>{this.renderList(2, 1)}</div>
          {this.state.isFullscreen && <this.Fullscreen />}
        </div>
      )
    } else if (this.props.list.length === 4) {
      return (
        <div className='image-galery' {...mainProps}>
          <div>{this.renderList(2, 0)}</div>
          <div>{this.renderList(2, 2)}</div>
          {this.state.isFullscreen && <this.Fullscreen />}
        </div>
      )
    } else if (this.props.list.length === 5) {
      return (
        <div className='image-galery' {...mainProps}>
          <div>{this.renderList(2, 0)}</div>
          <div>{this.renderList(3, 2)}</div>
          {this.state.isFullscreen && <this.Fullscreen />}
        </div>
      )
    } else if (this.props.list.length > 5) {
      return (
        <div className='image-galery' {...mainProps}>
          <div>{this.renderList(2, 0)}</div>
          <div>{this.renderList(3, 2, true)}</div>
          {this.state.isFullscreen && <this.Fullscreen />}
        </div>
      )
    }
  }
}
export function Fullscreen (props) {
  const list = props.list || this.props.list
  return (
    <div
      className='fullscreen-image'
      onClick={() => this.setState({ isFullscreen: false })}
    >
      <i className='fal fa-times' />
      <div>
        <i className='fal fa-angle-left' onClick={(evt) => {
          evt.stopPropagation()
          let index = this.state.index - 1
          if (index === -1) index = list.length - 1
          this.setState({ index })
        }} />
        <img
          alt={list[this.state.index].name}
          src={list[this.state.index].url}
          onClick={(evt) => {
            evt.stopPropagation()
            let index = this.state.index + 1
            if (index === list.length) index = 0
            this.setState({ index })
          }}
        />
        <i className='fal fa-angle-right' onClick={(evt) => {
          evt.stopPropagation()
          let index = this.state.index + 1
          if (index === list.length) index = 0
          this.setState({ index })
        }} />
      </div>
    </div>
  )
}
