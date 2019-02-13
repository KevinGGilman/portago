import React from 'react'
import { Button } from './Form'

export default class Images extends React.Component {
  constructor (props) {
    super(props)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }
  onDragStart (evt, index) {
    this.hasDropped = false
    this.item = this.getItem(evt.target)
    setTimeout(() => {
      this.placeholder = document.createElement('div')
      this.placeholder.setAttribute('class', 'placeholder')
      this.placeholder.setAttribute('index', index)
      this.placeholder.style.width = this.item.clientWidth + 'px'
      this.placeholder.style.height = this.item.clientHeight + 'px'
      this.item.style.display = 'none'
      this.item.insertAdjacentElement('afterend', this.placeholder)
    }, 10)
  }
  onDragOver (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    const newItem = this.getItem(evt.target)
    if (!newItem) return null
    this.item.style.display = ''
    this.item = newItem
    this.placeholder.style.width = this.item.clientWidth + 'px'
    this.placeholder.style.height = this.item.clientHeight + 'px'
    this.item.style.display = 'none'
    this.item.insertAdjacentElement('afterend', this.placeholder)
  }
  getItem (node) {
    if (['images', 'placeholder'].includes(node.className)) return null
    else if (node.className !== 'image-item') return this.getItem(node.parentNode)
    else return node
  }
  onDragEnd (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    setTimeout(() => {
      this.item.style.display = ''
      const draggedIndex = this.placeholder.getAttribute('index')
      if (this.hasDropped) {
        const droppedIndex = this.getIndex(this.placeholder, 0) - 1
        const items = this.reorder(this.props.list, draggedIndex, droppedIndex)
        this.props.onChange(items)
      } else {
        const list = this.props.list
        list.splice(draggedIndex, 1)
        this.props.onChange(list)
      }
      this.placeholder.parentNode.removeChild(this.placeholder)
    }, 10)
  }
  onDrop () {
    this.hasDropped = true
  }
  getIndex (child, index) {
    if (child.previousSibling === null) return index
    return this.getIndex(child.previousSibling, index + 1)
  }
  reorder (list, startIndex, endIndex) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }
  render () {
    return (
      <div
        className='image-manager'
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        {this.props.list.map((obj, index) => {
          return (
            <div
              draggable
              key={index}
              className='image-item'
              onClick={() => this.props.onSet(obj._id, index)}
              onDragEnd={this.onDragEnd}
              onDragStart={(evt) => this.onDragStart(evt, index)}
            >
              <img
                className={obj.type.replace('image/', '').replace('+xml', '')}
                src={obj.url}
                alt={obj.name.split('.')[0]}
              />
            </div>
          )
        })}
        {this.props.onAdd &&
          <Button faClass='far fa-plus' onClick={() => this.props.onAdd()}>Image</Button>
        }
      </div>
    )
  }
}
