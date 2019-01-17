import React from 'react'
import { Input, Button } from '../Form'
export default class Carousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: this.props.global.carousel
    }
    this.chooseFile = this.props.global.do.chooseFile.bind(this)
    this.setItem = this.setItem.bind(this)
    this.doAfterSilence = this.props.global.do.doAfterSilence.bind(this)
  }
  async addImage (type) {
    const file = await this.chooseFile(type)
    const item = { image: file, faType: 'Solid', title: '', paragraph: '' }
    this.props.global.socket.emit('carousel/insert', item, (err, result) => {
      if (err) return
      const list = [...this.state.list, result]
      this.setState({ list })
      console.log(result)
    })
  }
  delete (item, index) {
    this.state.list.splice(index, 1)
    this.forceUpdate()
    this.props.global.socket.emit('carousel/remove', { _id: item._id })
  }
  async setItem (index, key, value) {
    const list = this.state.list
    list[index][key] = value
    this.setState({ list })
    this.doAfterSilence(2000, () => {
      this.props.global.socket.emit('carousel/edit', list[index])
    })
  }

  swap (index, count) {
    let list = this.state.list;
    [list[index], list[index + count]] = [list[index + count], list[index]]
    this.forceUpdate()
    this.props.global.socket.emit('carousel/set/order', {
      idList: list.map(obj => obj._id)
    })
  }

  render () {
    return (
      <div className={`tool ${this.state.list.length ? '' : 'empty'}`}>
        <div className='list'>
          {this.state.list.map((item, index) => (
            <div className='item' key={item._id}>
              {item.customIcon && <img className='icon' src={item.customIcon} /> }
              <img className='image' src={item.image.url} />
              <div className='text'>
                <Input
                  value={item.title}
                  placeholder='Entrer un titre'
                  onChange={(value) => this.setItem(index, 'title', value)}
                />
                <Input
                  value={item.paragraph}
                  placeholder='Entrer une description'
                  onChange={(value) => this.setItem(index, 'paragraph', value)}
                />
                <Input
                  value={item.faIcon}
                  placeholder='Entrer a "Font Awesome" Icon name'
                  rightList={['Solid', 'Regular', 'Light', 'Brand']}
                  rightValue={item.faType}
                  onChange={(value) => this.setItem(index, 'faIcon', value)}
                  onOptionChange={(value) => this.setItem(index, 'faType', value)}
                >
                  <i className={`fa${(item.faType || ' ').charAt(0).toLowerCase()} fa-${item.faIcon || ''}`} />
                </Input>
                <div className='move'>
                  {index !== 0 &&
                    <i className='fas fa-arrow-square-up' onClick={() => this.swap(index, -1)} />
                  }
                  {index !== this.state.list.length - 1 &&
                    <i className='fas fa-arrow-square-down' onClick={() => this.swap(index, 1)} />
                  }
                </div>
              </div>
              <Button className='fas fa-trash' onClick={() => this.delete(item, index)} />
            </div>
          ))}
        </div>
        <div className='add button' onClick={() => this.addImage('image')}>
          <i className='far fa-plus' />Add an image
        </div>
      </div>
    )
  }
}
