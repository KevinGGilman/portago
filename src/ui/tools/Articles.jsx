import React from 'react'
import { Input, Button, Tab, Select } from '../Form'
import ImageManager from '../ImageManager'
export default class Articles extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: this.props.global[`${this.props.type}List`],
      lang: 'fr'
    }
    this.chooseFile = this.props.global.do.chooseFile.bind(this)
    this.addArticle = this.addArticle.bind(this)
    this.addImage = this.addImage.bind(this)
    this.setItem = this.setItem.bind(this)
    this.doAfterSilence = this.props.global.do.doAfterSilence.bind(this)
  }
  async addImage (index) {
    const list = this.state.list
    const file = await this.chooseFile('image')
    list[index].imageList.push(file)
    this.setState({ list })
    const query = {
      _id: list[index]._id,
      image: file
    }
    this.props.global.socket.emit('articles/push/image', query, (err, result) => {
      if (err) console.log(err)
    })
  }
  setImage (item, index) {
    const list = this.state.list
    list[index] = item
    this.setState({ list })
    this.props.global.socket.emit('articles/edit', item, (err, result) => {
      if (err) console.log(err)
    })
  }
  addArticle (type) {
    const query = { type: this.props.type }
    this.props.global.socket.emit('articles/insert', query, (err, result) => {
      if (err) return
      const list = [...this.state.list, result]
      this.setState({ list })
    })
  }
  delete (item, index) {
    this.state.list.splice(index, 1)
    this.forceUpdate()
    this.props.global.socket.emit('articles/remove', { _id: item._id })
  }
  setItem (index, key, value) {
    const list = this.state.list
    if (['name', 'description'].includes(key)) {
      list[index][this.state.lang][key] = value
    } else {
      list[index][key] = value
    }
    this.setState({ list })
    this.doAfterSilence(1000, () => {
      this.props.global.socket.emit('articles/edit', list[index])
    })
  }

  swap (index, count) {
    let list = this.state.list;
    [list[index], list[index + count]] = [list[index + count], list[index]]
    this.forceUpdate()
    this.props.global.socket.emit('articles/set/order', {
      idList: list.map(obj => obj._id)
    })
  }
  componentWillUpdate (newProps) {
    if (this.props.type !== newProps.type) {
      this.setState({ list: this.props.global[`${newProps.type}List`] })
    }
  }
  render () {
    return (
      <div className={`tool ${this.state.list.length ? '' : 'empty'}`}>
        {!!this.state.list.length &&
          <Tab
            value={this.state.lang}
            optionList={['fr', 'en']}
            outputList={[this.props.global.say.fr, this.props.global.say.en]}
            onChange={(value) => this.setState({ lang: value })}
          />
        }
        <div className='list'>
          {this.state.list.map((item, index) => (
            <div className='item' key={item._id}>

              <div className='text'>
                <ImageManager
                  list={item.imageList}
                  onChange={(imageList) => this.setImage({ ...item, imageList }, index)}
                  onAdd={() => this.addImage(index)}
                />
                <Input
                  value={item[this.state.lang].name}
                  placeholder={this.props.global.say.namePlaceholder}
                  onChange={(value) => this.setItem(index, 'name', value)}
                />
                <Input
                  value={item[this.state.lang].description}
                  placeholder={this.props.global.say.descriptionPlaceholder}
                  onChange={(value) => this.setItem(index, 'description', value)}
                />
                <Input
                  value={item.count}
                  placeholder={this.props.global.say.countPlaceholder}
                  onChange={(value) => this.setItem(index, 'count', value)}
                />
                { this.props.type === 'pocket' &&
                  <Select
                    value={item.category ? this.props.global.categoryMap[item.category][this.state.lang] : ''}
                    placeholder={this.props.global.say.categoryPlaceholder}
                    optionList={this.props.global.categoryList.map(obj => obj._id)}
                    outputList={this.props.global.categoryList.map(obj => obj[this.state.lang])}
                    onChange={(value) => this.setItem(index, 'category', value)}
                  />
                }
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
        <div className='add button' onClick={() => this.addArticle()}>
          <i className='far fa-plus' />
          {this.props.global.say[`add${this.props.type.charAt(0).toUpperCase()}${this.props.type.slice(1)}`]}
        </div>
      </div>
    )
  }
}
