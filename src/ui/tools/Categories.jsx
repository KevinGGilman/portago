import React from 'react'
import { Input, Button } from '../Form'
import { Pic } from '../Pic'
import resizebase64 from 'resize-base64'
export default class Categories extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: this.props.global.categoryList
    }
    this.addItem = this.addItem.bind(this)
    this.setItem = this.setItem.bind(this)
    this.chooseFile = this.props.global.do.chooseFile.bind(this)
    this.setImage = this.setImage.bind(this)
    this.doAfterSilence = this.props.global.do.doAfterSilence.bind(this)
  }
  async setImage (_id, index) {
    const file = await this.chooseFile('image')
    const image = { ...file, _id, urlShort: resizebase64(file.url, 200, 200) }
    const list = this.state.list
    list[index] = { ...list[index], image }
    this.setState({ list })
    this.props.global.socket.emit('files/set/image', image, (err, result) => {
      if (err) return
      const list = [...this.state.list, result]
      this.setState({ list })
    })
  }
  async addItem () {
    const file = await this.chooseFile('image')
    const item = { image: file }
    item.image.urlShort = resizebase64(item.image.url, 200, 200)
    this.props.global.socket.emit('categories/insert', item, (err, result) => {
      if (err) return
      const list = [...this.state.list, result]
      this.setState({ list })
    })
  }
  delete (item, index) {
    this.state.list.splice(index, 1)
    this.forceUpdate()
    this.props.global.socket.emit('categories/remove', { _id: item._id })
  }
  setItem (index, key, value) {
    const list = this.state.list
    list[index][key] = value
    this.setState({ list })
    this.doAfterSilence(1000, () => {
      this.props.global.socket.emit('categories/edit', list[index])
      this.props.global.setState({
        categoryList: list,
        categoryMap: this.props.global.do.listToMap(list)
      })
    })
  }

  render () {
    return (
      <div className={`tool ${this.state.list.length ? '' : 'empty'}`}>
        <div className='list'>
          {this.state.list.map((item, index) => (
            <div className='item' key={item._id}>
              <Pic
                image={item.image.url}
                onClick={() => this.setImage(item.image._id, index)}
              />
              <div className='text'>
                <Input
                  value={item.fr}
                  placeholder={this.props.global.say.frNamePlaceholder}
                  onChange={(value) => this.setItem(index, 'fr', value)}
                />
                <Input
                  value={item.en}
                  placeholder={this.props.global.say.enNamePlaceholder}
                  onChange={(value) => this.setItem(index, 'en', value)}
                />
              </div>
              <Button className='fas fa-trash' onClick={() => this.delete(item, index)} />
            </div>
          ))}
        </div>
        <div className='add button' onClick={() => this.addItem()}>
          <i className='far fa-plus' />{this.props.global.say.addCategory}
        </div>
      </div>
    )
  }
}
