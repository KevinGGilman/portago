import React from 'react'
import { Input, Button, Tab } from '../Form'
export default class Carousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: this.props.global.locationList,
      lang: 'fr'
    }
    this.setItem = this.setItem.bind(this)
    this.doAfterSilence = this.props.global.do.doAfterSilence.bind(this)
  }
  addLocation () {
    this.props.global.socket.emit('locations/insert', {}, (err, result) => {
      if (err) return
      const list = [...this.state.list, result]
      this.setState({ list })
    })
  }
  delete (item, index) {
    const query = { _id: item._id }
    this.state.list.splice(index, 1)
    this.props.global.socket.emit('locations/remove', query)
  }
  setItem (index, key, value) {
    const list = this.state.list
    if (['address', 'description'].includes(key)) {
      list[index][this.state.lang][key] = value
    } else {
      list[index][key] = value
    }
    this.setState({ list })
    this.doAfterSilence(1000, () => {
      this.props.global.socket.emit('locations/edit', list[index], (err, result) => {
        if (err) return console.log(err)
        list[index] = result
        this.setState({ list })
      })
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
              <div className='text'>
                <Input
                  value={item[this.state.lang].address}
                  placeholder={this.props.global.say.addressPlaceholder}
                  onChange={(value) => this.setItem(index, 'address', value)}
                />
                <Input
                  value={item[this.state.lang].description}
                  placeholder={this.props.global.say.descriptionPlaceholder}
                  onChange={(value) => this.setItem(index, 'description', value)}
                />
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
        <div className='add button' onClick={() => this.addLocation()}>
          <i className='far fa-plus' />{this.props.global.say.addLocation}
        </div>
      </div>
    )
  }
}
