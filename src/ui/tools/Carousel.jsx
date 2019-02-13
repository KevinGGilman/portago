import React from 'react'
import { Pic } from '../Pic'
import { Input, Button, Tab } from '../Form'
import resizebase64 from 'resize-base64'
export default class Carousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: this.props.global.carousel,
      lang: 'fr'
    }
    this.chooseFile = this.props.global.do.chooseFile.bind(this)
    this.setItem = this.setItem.bind(this)
    this.doAfterSilence = this.props.global.do.doAfterSilence.bind(this)
  }
  setImage (_id, index) {
    this.chooseFile('image', false, (file) => {
      file.urlShort = resizebase64(file.url, 200, 200)
      file.url = resizebase64(file.url, 1920, 1080)
      const image = { ...file, _id, collection: 'carousel' }
      const list = this.state.list
      list[index] = { ...list[index], image }
      this.setState({ list })
      this.props.global.socket.emit('files/set/image', image, (err) => {
        if (err) console.log(err)
        this.props.global.setState({ isHoverLoading: false })
      })
    })
  }
  componentWillReceiveProps (newProps) {
    this.setState({ list: newProps.global.carousel })
  }
  addImage () {
    this.chooseFile('image', false, (file) => {
      file.urlShort = resizebase64(file.url, 200, 200)
      file.url = resizebase64(file.url, 1920, 1080)
      const item = { image: file }
      this.props.global.socket.emit('carousel/insert', item, (err, result) => {
        if (err) return
        this.props.global.setState({ isHoverLoading: false })
        console.log(result)
        const list = [...this.state.list, {
          ...result,
          fr: { title: '', description: '' },
          en: { title: '', description: '' },
          faType: 'Solid'
        }]
        this.setState({ list })
      })
    })
  }
  delete (item, index) {
    this.state.list.splice(index, 1)
    this.forceUpdate()
    this.props.global.socket.emit('carousel/remove', { _id: item._id })
  }
  setItem (index, key, value) {
    const list = this.state.list
    if (['title', 'description'].includes(key)) {
      list[index][this.state.lang][key] = value
    } else {
      list[index][key] = value
    }
    this.setState({ list })
    this.doAfterSilence(1000, () => {
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
              {item.customIcon && <img className='icon' src={item.customIcon} alt='icon' /> }
              <Pic
                global={this.props.global}
                image={item.image}
                onClick={() => this.setImage(item.image, index)}
              />
              <div className='text'>
                <Input
                  value={item[this.state.lang].title}
                  placeholder={this.props.global.say.titlePlaceholder}
                  onChange={(value) => this.setItem(index, 'title', value)}
                />
                <Input
                  value={item[this.state.lang].description}
                  placeholder={this.props.global.say.descriptionPlaceholder}
                  onChange={(value) => this.setItem(index, 'description', value)}
                />
                <Input
                  value={item.faIcon}
                  placeholder={this.props.global.say.iconPlaceholder}
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
        <div className='add button' onClick={() => this.addImage()}>
          <i className='far fa-plus' />{this.props.global.say.addImage}
        </div>
      </div>
    )
  }
}
