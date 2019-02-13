import React from 'react'
import { Button, Tab } from '../Form'
import TextArea from './../TextArea'
export default class About extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      list: this.props.global.postList,
      lang: 'fr'
    }
    this.setItem = this.setItem.bind(this)
    this.doAfterSilence = this.props.global.do.doAfterSilence.bind(this)
  }
  addLocation () {
    this.props.global.socket.emit('posts/insert', {}, (err, result) => {
      if (err) return
      const list = [...this.state.list, result]
      this.setState({ list })
    })
  }
  setItem (index, key, value) {
    const list = this.state.list
    list[index][this.state.lang][key] = value
    this.setState({ list })
    this.doAfterSilence(1000, () => {
      this.props.global.socket.emit('posts/edit', list[index], (err, result) => {
        if (err) return console.log(err)
        list[index] = result
        this.setState({ list })
      })
    })
  }
  delete (item, index) {
    this.state.list.splice(index, 1)
    this.forceUpdate()
    this.props.global.socket.emit('posts/remove', { _id: item._id })
  }

  swap (index, count) {
    let list = this.state.list;
    [list[index], list[index + count]] = [list[index + count], list[index]]
    this.forceUpdate()
    this.props.global.socket.emit('posts/set/order', {
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
              <div className='vertical-container'>
                {this.state.lang === 'fr' &&
                <TextArea
                  global={this.props.global}
                  onChange={(html) => this.setItem(index, 'content', html)}
                  value={item.fr.content}
                  placeholder={this.props.global.say.textareaPlaceholder}
                  disableEmoji
                />
                }
                {this.state.lang === 'en' &&
                <TextArea
                  global={this.props.global}
                  onChange={(html) => this.setItem(index, 'content', html)}
                  value={item.en.content}
                  placeholder={this.props.global.say.textareaPlaceholder}
                  disableEmoji
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
        <div className='add button' onClick={() => this.addLocation()}>
          <i className='far fa-plus' />{this.props.global.say.addPost}
        </div>
      </div>
    )
  }
}
