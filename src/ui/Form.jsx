import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import urlapi from 'url'
/*****************************************************************************
----------------------------------Content  ----------------------------------
1.  functions
2.  input
3.  Select
4.  Dropdown
5.  Toggle
6.  ToggleList
7.  Button
8.  Output
9.  Label
10. Fieldset
11. Modal
*****************************************************************************/

/*****************************************************************************
functions
*****************************************************************************/
function createComponentObject (Component, opts) {
  const { Consumer } = React.createContext(new Map())
  if (typeof opts === 'string') opts = { prefix: opts }
  const isClassy = Component.prototype && Component.prototype.isReactComponent
  const { prefix, forwardRefAs = isClassy ? 'ref' : 'innerRef' } = opts
  const name = Component.displayName || Component.name
  function forwardRef ({ bsPrefix, ...props }, ref) {
    props[forwardRefAs] = ref
    return (
      <Consumer>
        {prefixes => (
          <Component
            {...props}
            bsPrefix={bsPrefix || prefixes.get(prefix) || prefix}
          />
        )}
      </Consumer>
    )
  }
  forwardRef.displayName = `Bootstrap(${name})`
  return React.forwardRef(forwardRef)
}

function getData (url) {
  let obj = {}
  let fullUrl = url
  if (!url.includes('www.') && !url.includes('http://') && !url.includes('https://')) {
    fullUrl = 'http://www.' + url
  } else if (!url.includes('http://') && !url.includes('https://') && url.includes('www.')) {
    fullUrl = 'http://' + url
  }
  url.includes('facebook') ? obj['image'] = 'images/facebook.jpg' : obj['image'] = 'images/defaultLink.jpg'
  let host = urlapi.parse(fullUrl).hostname
  obj.title = host
  obj.url = fullUrl
  return obj
}

function linkRequest (url) {
  let { linkList } = this.props
  const isInList = linkList.findIndex((item, index) => item.url === url) !== -1
  if (isInList || url === '') return
  const xmlhttp = new window.XMLHttpRequest()
  xmlhttp.open('GET', 'http://api.linkpreview.net/?key=5b4239cb5ed5fa9dc0b4a2809b2e4e26480b54f8e7c2a&q=' + url)
  xmlhttp.onload = function (e) {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      const link = JSON.parse(xmlhttp.responseText)
      const host = getData(link.url).title.replace('www.', '')
      if (!link.image) {
        link.image = 'images/defaultLink.jpg'
      } else if (!link.image.includes(host) && !host.includes('youtube')) {
        link.image = `http://www.${host}/${link.image}`
      }
      linkList.push(link)
    } else {
      linkList.push(getData(url))
    }
    this.setState({ value: '' })
    this.props.onListChange(linkList)
  }.bind(this)
  xmlhttp.send()
}

function setLocation (adresse) {
  let { locationList } = this.props
  const isInList = locationList.findIndex((item, index) => item.adresse === adresse) !== -1
  if (isInList) return
  const formatedAdress = adresse.split(' ').join('+')
  const formatedAdress1 = adresse.split(' ').join('%2c')
  const x = 107
  const y = 60
  const image = `https://maps.googleapis.com/maps/api/staticmap?&size=${x}x${y}&maptype=roadmap&markers=size:small%7ccolor:0x4791F1%7c${formatedAdress}&key=AIzaSyAmd2m6AMADZKmom9FcqafCRtTRW0k0-iU`
  const url = `https://www.google.com/maps/search/?api=1&query=${formatedAdress1}`
  const obj = { adresse, image, url }
  locationList.push(obj)
  this.props.onListChange(locationList)
  this.setState({ value: '' })
}

const setCurrency = (props, value) => {
  if (value.includes(',') && value.includes('.')) {
    value = value.replace(',', '')
  }
  value = value.replace(',', '.').replace('$', '')

  value = Number(value)
  if (isNaN(value)) return props.onChange(value)
  value = new Intl.NumberFormat('en',
    { style: 'currency', currency: props.currency }).format(value)
  value = value.replace(/[A-Z]+/, '')
  props.onChange(value)
}

/*****************************************************************************
Input
*****************************************************************************/
export class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isSelecting: false, value: '' }
    this.closeSelect = this.closeSelect.bind(this)
    if (props.linkList) this.linkRequest = linkRequest.bind(this)
    if (props.locationList) this.setLocation = setLocation.bind(this)
  }
  openSelect () {
    this.setState({ isSelecting: true })
    this.closeSelect.first = true
    document.addEventListener('click', this.closeSelect)
  }
  closeSelect (e) {
    if (this.closeSelect.first) {
      this.closeSelect.first = false
      return
    }
    const inputNode = ReactDOM.findDOMNode(this.inputRef)
    if (e.target === inputNode.children[0]) return
    this.setState({ isSelecting: false })
    document.removeEventListener('click', this.closeSelect)
  }
  filterDropdown () {
    const { value, bottomList, isSearch } = this.props
    if (!value || !isSearch) return bottomList
    const lowered = value.toLowerCase()
    return bottomList.filter(v => v.toLowerCase().includes(lowered))
  }
  componentDidMount () {
    if (this.props.autoFocus) this.inputRef.focus()
  }

  render () {
    const className = ['input']
    if (this.props.className) className.push(this.props.className)
    if (this.props.rightList || this.props.linkList || this.props.locationList) {
      className.push('right-list')
    }
    if (this.props.bottomList) className.push('bottom-list')
    return (
      <div className={className.join(' ')}>
        {this.props.children}
        <input
          ref={(ref) => { this.inputRef = ref }}
          type={this.props.type ? this.props.type : 'text'}
          value={this.props.value || this.state.value}
          onChange={(evt) => this.props.onChange
            ? this.props.onChange(evt.target.value)
            : this.setState({ value: evt.target.value })
          }
          onBlur={(evt) => {
            this.props.currency && setCurrency(this.props, evt.target.value)
            this.props.onBlur && this.props.onBlur()
          }}
          onPaste={(evt) => {
            if (this.props.linkList) this.linkRequest(evt.clipboardData.getData('Text'))
            else if (this.props.locationList) this.setLocation(evt.clipboardData.getData('Text'))
            if (this.props.onPaste) this.props.onPaste()
          }}
          onKeyUp={(evt) => {
            if (evt.keyCode === 13) {
              if (this.props.linkList) this.linkRequest(this.state.value || this.props.value)
              else if (this.props.locationList) this.setLocation(this.state.value)
              if (this.props.onEnterKey) this.props.onEnterKey()
            }
          }}
          onFocus={() => this.props.bottomList && this.openSelect()}
          placeholder={this.props.placeholder}
        />
        {this.props.rightList &&
          <Select
            value={this.props.rightValue}
            optionList={this.props.rightList}
            outputList={this.props.outputList}
            onChange={(item) => this.props.onOptionChange(item)}
          />
        }
        {this.props.linkList &&
          <i
            onClick={() => this.linkRequest(this.state.value)}
            title='button add a link'
            className='far fa-plus select'
          />
        }
        {this.props.locationList &&
          <i
            onClick={() => this.setLocation(this.state.value)}
            className='far fa-plus select'
          />
        }

        {this.props.onClose &&
          <i
            onClick={() => this.props.onClose()}
            className='far fa-times select'
          />
        }
        {this.state.isSelecting &&
          <Dropdown
            optionList={this.filterDropdown()}
            outputList={this.props.outputList}
            onChange={(value) => this.props.onChange(value)}
          />
        }

      </div>
    )
  }
}
/*****************************************************************************
Select
*****************************************************************************/
export class Select extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isSelecting: false }
    this.closeSelect = this.closeSelect.bind(this)
  }
  openSelect () {
    this.setState({ isSelecting: true })
    document.addEventListener('click', this.closeSelect)
  }
  closeSelect (e) {
    this.setState({ isSelecting: false })
    document.removeEventListener('click', this.closeSelect)
  }
  renderValue (value, auto, plural, placeholder) {
    if (!(value instanceof moment) && typeof value === 'object') return value
    if (!value && value !== 0) return placeholder
    if (value instanceof moment) return value.format('ddd MMM DD')
    if (plural && value > 1) auto = plural
    return `${value} ${auto || ''}`
  }
  render () {
    return (
      <span
        ref={(ref) => { this.selectRef = ref }}
        className={`select ${this.props.className || ''}`}
        onClick={this.openSelect.bind(this)}>
        {this.renderValue(
          this.props.value,
          this.props.default,
          this.props.plural,
          this.props.placeholder
        )}
        {this.state.isSelecting &&
          <Dropdown {...this.props} />
        }
      </span>
    )
  }
}
export class SelectDate extends Select {
  constructor (props) {
    super(props)
    this.state = {
      isSelecting: false,
      monthHover: false,
      month: 'Today',
      year: new Date().getFullYear()
    }
  }
  closeSelect (e) {
    const left = ReactDOM.findDOMNode(this.left)
    const right = ReactDOM.findDOMNode(this.right)
    if (e.target !== left && e.target !== right) {
      document.removeEventListener('click', this.closeSelect)
      this.setState({ isSelecting: false })
      if (this.props.setState) this.props.setState({ isSelecting: false })
    }
  }
  onMonthChange (month) {
    this.setState({ month })
    if (this.props.onChange) {
      if (month === 'Today') this.props.onChange(moment())
      else this.props.onChange(moment(`${this.state.year}-${month}`, 'YYYY-MMM'))
    }
  }
  incrementMonth (value) {
    let newDate
    if (this.state.month === 'Today') {
      newDate = value > 0 ? moment().add(1, 'months') : moment().subtract(1, 'months')
    } else {
      newDate = value > 0
        ? moment(`${this.state.year}-${this.state.month}`, 'YYYY-MMM').add(1, 'months')
        : moment(`${this.state.year}-${this.state.month}`, 'YYYY-MMM').subtract(1, 'months')
    }
    this.setState({ year: newDate.format('YYYY'), month: newDate.format('MMM') })
    this.props.onChange(newDate)
  }
  renderMonthHover () {
    const { monthHover, year } = this.state
    return (
      <span className='date hover'>{monthHover === 'Today' ? 'Today' : `${monthHover} ${year}`}</span>
    )
  }
  renderYear () {
    return (
      <div>
        {this.renderArrow(true, 'left')}
        <span className='date'>{this.state.year}</span>
        {this.renderArrow(true, 'right')}
      </div>
    )
  }
  renderArrow (isYear, name) {
    const count = name === 'left' ? -1 : 1
    const year = this.state.year + count
    return (
      <i
        ref={(ref) => { if (isYear) this[name] = ref }}
        onClick={() => isYear ? this.setState({ year }) : this.incrementMonth(count)}
        title={`arrow ${name}`}
        className={`far fa-angle-${name}`}
      />
    )
  }
  renderDefault () {
    return (
      <div>
        {this.renderArrow(false, 'left')}
        <span className='date' onClick={() => {
          super.openSelect()
          if (this.props.setState) this.props.setState({ isSelecting: true })
        }}>
          {`${this.state.month}`} {this.state.month !== 'Today' && this.state.year}
        </span>
        {this.renderArrow(false, 'right')}
      </div>
    )
  }
  render () {
    const className = ['select-month']
    if (this.props.className) className.push(this.props.className)
    if (this.state.isSelecting) className.push('active')
    return (
      <div className={className.join(' ')}>
        {this.state.isSelecting
          ? this.state.monthHover
            ? this.renderMonthHover()
            : this.renderYear()
          : this.renderDefault()
        }
        {this.state.isSelecting &&
          <DropdownDate
            {...this.props}
            {...this.state}
            setState={(obj) => this.setState(obj)}
            onMonthChange={this.onMonthChange.bind(this)}
          />
        }
      </div>
    )
  }
}

/*****************************************************************************
Dropdown
*****************************************************************************/
export class Dropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isSelecting: false }
    this.getDropdownStyles = this.getDropdownStyles.bind(this)
  }
  componentDidMount () {
    window.addEventListener('resize', this.getDropdownStyles)
    this.setState({ isStylesUpdated: false })
  }
  getScrollParents (scrollParents, node) {
    if (node == null) return scrollParents
    if (node.scrollHeight > node.clientHeight) scrollParents.push(node)
    return this.getScrollParents(scrollParents, node.parentNode)
  }
  componentDidUpdate () {
    if (!this.state.isStylesUpdated) {
      const dropdownNode = ReactDOM.findDOMNode(this.dropdownRef)
      this.scrollNodes = this.getScrollParents([], dropdownNode.parentNode)
      this.scrollNodes.forEach((node) => {
        node.addEventListener('scroll', this.getDropdownStyles)
      })
      this.getDropdownStyles(dropdownNode)
    }
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.getDropdownStyles)
    this.scrollNodes.forEach((node) => {
      if (!node) return
      node.removeEventListener('scroll', this.getDropdownStyles)
    })
  }
  getDropdownStyles () {
    const node = ReactDOM.findDOMNode(this.dropdownRef)
    let style = {}
    if (node) {
      const { bottom, top, right, width } = node.parentNode.getBoundingClientRect()
      const fullHeight = window.innerHeight
      style.right = window.innerWidth - right
      style.minWidth = width
      if (fullHeight - bottom < fullHeight / 3) {
        style.bottom = window.innerHeight - top + 5
        style.maxHeight = top - 20
        style.flexDirection = 'column-reverse'
      } else {
        style.top = bottom + 5
        style.maxHeight = window.innerHeight - bottom - 20
      }
    }
    this.setState({ style, isStylesUpdated: true })
  }
  renderValue (value, auto, plural, placeholder) {
    if (plural && value > 1 && !isNaN(value)) auto = plural
    return `${value} ${auto || ''}`
  }
  render () {
    return (
      <div
        className={`dropdown ${this.props.dropdownClass || ''}`}
        style={this.state.style}
        ref={(ref) => { this.dropdownRef = ref }}
      >
        {this.props.optionList.map((value, index) => (
          <span
            key={index}
            onClick={() => this.props.onChange(value, index)}
          >
            {this.props.outputList && this.props.outputList[index]}
            {!this.props.outputList && (((isNaN(value) || value instanceof moment) && this.props.default)
              ? <React.Fragment>
                <span>{this.renderValue(index + 1, this.props.default, this.props.plural)}</span>
                <span>{value instanceof moment ? value.format('ddd MMM DD') : value}</span>
              </React.Fragment>
              : this.renderValue(value, this.props.default, this.props.plural)
            )}
          </span>
        ))}
      </div>
    )
  }
}

class DropdownDate extends Dropdown {
  render () {
    return (
      <div className='dropdown'
        style={this.state.style}
        ref={(ref) => { this.dropdownRef = ref }}
      >
        <span
          onMouseEnter={() => this.props.setState({ monthHover: 'Today' })}
          onMouseLeave={() => this.props.setState({ monthHover: false })}
          onClick={() => this.props.onMonthChange('Today')}
        >Today
        </span>
        {moment.monthsShort().slice(0).reverse().map((month, index) => {
          const longMonth = moment(month, 'MMM').format('MMM')
          return (
            <span
              onMouseEnter={() => this.props.setState({ monthHover: longMonth })}
              onMouseLeave={() => this.props.setState({ monthHover: false })}
              onClick={() => this.props.onMonthChange(longMonth)}
              key={index}>{longMonth}
            </span>
          )
        })}
      </div>
    )
  }
}
/*****************************************************************************
Navigation
*****************************************************************************/
export class Navigation extends Select {
  closeSelect (evt) {
    const item = this.getItem(evt.target)
    const dropdownNode = document.getElementById(this.id)
    if (item.getAttribute('noclose')) return
    if (!item || !item.getAttribute('submenu') ||
    (item !== this.selectedItem && !dropdownNode.contains(item)) ||
    item === this.selectedItem) {
      setTimeout(() => {
        this.setState({ isSelecting: false })
        document.removeEventListener('click', this.closeSelect)
      }, this.getIndex(dropdownNode.parentNode, 0) * 10)
    }
  }
  getIndex (child, index) {
    if (child.previousSibling === null) return index
    return this.getIndex(child.previousSibling, index + 1)
  }
  openSelect (evt) {
    this.setState({ isSelecting: true })
    this.selectedItem = this.getItem(evt.target)
    this.id = Math.random()
    document.addEventListener('click', this.closeSelect)
  }
  getItem (node) {
    if (node.className === 'item') return node
    if (node === document.body) return null
    else return node.parentNode
  }
  render () {
    return (
      <div
        className='navigation-icon'
        onClick={this.openSelect}
      >
        {this.props.children}
        {this.state.isSelecting &&
          <DropdownNav id={this.id} {...this.props} />
        }
      </div>
    )
  }
}
export class DropdownNav extends Dropdown {
  renderDropdownContent () {
    ReactDOM.render(
      <div className='navigation' id={this.props.id}>
        <div
          className='dropdown'
          style={this.state.style}
        >
          {this.props.optionList.map((obj, index) => (
            obj.onClick
              ? <span
                key={index}
                className='item'
                submenu={obj.isSubMenu}
                noclose={obj.noClose}
                onClick={obj.onClick}
              >
                {obj.value}
              </span>
              : obj.value
                ? <span
                  key={index}
                  className='label'
                  submenu={obj.isSubMenu}
                  noclose={obj.noClose}
                >
                  {obj.value}
                </span>
                : <span key={index} className='line' />
          ))}
        </div>
      </div>, this.dropdownNode
    )
  }
}
/*****************************************************************************
Toggle
*****************************************************************************/
export const Toggle = (props) => (
  <span
    className={`toggle ${props.value && 'clicked'} ${props.className || ''}`}
    onClick={() => props.onChange(!props.value)}
  >
    {props.name}
  </span>
)

/*****************************************************************************
ToggleList
*****************************************************************************/
export class ToggleGroup extends React.Component {
  constructor (props) {
    super(props)
    const value = typeof this.props.defaultValue === 'object'
      ? this.props.defaultValue : [this.props.defaultValue]
    this.state = { valueList: this.props.defaultValue ? value : [] }
  }
  setList (isClicked, option) {
    let { valueList } = this.state
    if (isClicked) valueList.push(option)
    else valueList.splice(valueList.indexOf(option), 1)
    this.setState({ valueList })
    this.props.onChange(valueList)
  }
  setItem (isClicked, option) {
    this.setState({ valueList: [option] })
    this.props.onChange(isClicked ? option : '')
  }
  render () {
    return (
      <div className={`toggle-group ${this.props.className || ''}`}>
        {this.props.optionList.map((option, index) => (
          <Toggle
            key={index}
            name={option}
            value={this.state.valueList.includes(option)}
            onChange={(value) => {
              this.props.isOne ? this.setItem(value, option)
                : this.setList(value, option)
            }} />
        ))}
      </div>
    )
  }
}

/*****************************************************************************
Tooltip
*****************************************************************************/
export class Tooltip extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isActive: false }
  }
  componentDidMount () {
    this.setPosition()
    this.toggleTooltip = this.toggleTooltip.bind(this)
    this.tooltipRef.parentNode.style.position = 'relative'
    this.tooltipRef.parentNode.addEventListener('mouseenter', this.toggleTooltip)
    this.tooltipRef.parentNode.addEventListener('mouseleave', this.toggleTooltip)
  }
  componentWillUnmount () {
    this.tooltipRef.parentNode.removeEventListener('mouseenter', this.toggleTooltip)
    this.tooltipRef.parentNode.removeEventListener('mouseleave', this.toggleTooltip)
  }
  toggleTooltip (evt) {
    this.setPosition()
    this.setState({ isActive: !this.state.isActive })
  }
  setPosition () {
    const pos = this.tooltipRef.parentNode.getBoundingClientRect()
    const { width, height, top } = this.tooltipRef.getBoundingClientRect()
    if (window.innerWidth - pos.right > 100 && pos.left > 100) {
      this.tooltipRef.style.left = pos.left + pos.width / 2 - width / 2 + 'px'
      this.pointerRef.style.left = width / 2 - 8 + 'px'
    } else if (pos.left < 100) {
      this.tooltipRef.style.left = '10px'
      this.pointerRef.style.left = pos.left + 5 + 'px'
    } else {
      this.tooltipRef.style.right = window.innerWidth - pos.right + 'px'
      this.pointerRef.style.right = '5px'
    }
    if (top < 10) {
      this.tooltipRef.style.top = pos.bottom + 8 + 'px'
      this.pointerRef.style.bottom = 'initial'
      this.pointerRef.style.top = '8px'
      this.pointerRef.style.borderBottom = '8px solid hsla(0, 0%, 0%, 0.8)'
      this.pointerRef.style.borderTop = 'none'
    } else {
      this.tooltipRef.style.top = pos.top - height - 8 + 'px'
      this.pointerRef.style.top = 'initial'
      this.pointerRef.style.bottom = '-8px'
      this.pointerRef.style.borderTop = '8px solid hsla(0, 0%, 0%, 0.8)'
      this.pointerRef.style.borderBottom = 'none'
    }
  }
  componentDidUpdate () {
    this.setPosition()
  }
  render () {
    const className = ['tooltip', this.props.className]
    if (this.state.isActive) className.push('active')
    return (
      <div
        className={className.join(' ')}
        ref={ref => { this.tooltipRef = ref }}
      >
        {(this.props.list || []).map((val, index) => <span key={index}>{val}</span>)}
        {this.props.children &&
        <span>
          {this.props.children}
        </span>
        }
        <div className='pointer' ref={ref => { this.pointerRef = ref }} />
      </div>
    )
  }
}
/*****************************************************************************
ToggleGroup
*****************************************************************************/
export const RadioGroup = (props) => (
  <>
    {props.optionList.map((value) => (
      <div
        key={value}
        className={`radio  ${props.className || ''}`}
        onClick={() => props.onChange(value)}
      >
        <i className={`${props.value === value ? 'far fa-check' : ''}`} />
        <span>{value}</span>

      </div>
    ))}
  </>
)

/*****************************************************************************
Button
*****************************************************************************/
export const Button = (props) => (
  <span
    className={`button ${props.className || ''}`}
    onClick={props.onClick}
  >
    {props.children}
    {props.faClass && <i
      title={props.faClass.split(' ')[1].replace(/fa-/g, ' ')}
      className={props.faClass}
    />
    }
  </span>
)

/*****************************************************************************
Output
*****************************************************************************/
export const Output = (props) => (
  <div className={`output ${props.className || ''}`}>
    {props.value && <span>{props.value}</span>}
    {props.valueList &&
      <React.Fragment>
        {props.valueList.map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </React.Fragment>
    }
  </div>
)
/*****************************************************************************
Label
*****************************************************************************/
export const Label = (props) => (
  <span style={props.style} className={`${props.className || ''} label`}>
    {props.children}
  </span>
)
/*****************************************************************************
Tab
*****************************************************************************/
export const Tab = (props) => (
  <div className='tab-group'>
    {props.optionList.map((value, index) => (
      <span
        key={value}
        className={`${props.value === value ? 'active' : ''} ${props.className || ''}`}
        onClick={() => props.onChange(value)}
      >
        {props.outputList[index]}
      </span>
    ))}
    {props.children}
  </div>
)

/*****************************************************************************
Fieldset
*****************************************************************************/
const isAllEmptyChildren = (props) => {
  return React.Children.toArray(props.children).reduce((isAllEmpty, child) => {
    return isAllEmpty && !child.props.value && !((child.props.valueList || []).length)
  }, true)
}
const isSomeEmptyChildren = (props) => {
  return React.Children.toArray(props.children).reduce((isSomeEmpty, child) => {
    return isSomeEmpty || (
      !child.props.value &&
      child.props.value !== 0 &&
      !((child.props.valueList || []).length) &&
      !child.type.name.includes('Toggle')
    )
  }, false)
}
export const Fieldset = (props) => {
  if (props.hideEmpty && isAllEmptyChildren(props)) return null
  let className = ['fieldset']
  if (props.className) className.push(props.className)
  if (props.isValidation && isSomeEmptyChildren(props)) className.push('error')
  return (
    <div className={className.join(' ')}>
      <Label >{props.label}</Label>
      <div>
        {props.children}
      </div>
    </div>
  )
}
/*****************************************************************************
Modal
*****************************************************************************/
class ModalContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickInside = this.handleClickInside.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }
  componentDidMount () {
    this.modal = document.createElement('div')
    this.modal.setAttribute('id', 'modal')
    document.body.appendChild(this.modal)
    this.renderModalContent(this.props)
  }
  componentWillReceiveProps (newProps) {
    this.renderModalContent(newProps)
  }
  componentWillUnmount () {
    ReactDOM.unmountComponentAtNode(this.modal)
    document.body.removeChild(this.modal)
  }
  handleClickInside (e) {
    e.stopPropagation()
  }
  handleClickOutside () {
    this.props.closeModal && this.props.closeModal()
  }
  renderModalContent (props) {
    ReactDOM.render(
      <div className='modal-parent' onClick={this.handleClickOutside}>
        <div className={`modal-content ${props.className}`} onClick={this.handleClickInside}>
          {props.children}
        </div>
      </div>,
      this.modal
    )
  }
  render () { return null }
}

const Header = (props) => (
  <div className={`modal-header ${props.className || ''}`}>
    {props.onClose &&
      <i className='far fa-angle-left' onClick={() => props.onClose()} />
    }
    {props.title && <h4 className='modal-title'>{props.title}</h4>}
    {props.children}
  </div>
)

const Body = (props) => (
  <div className={`modal-body ${props.className || ''}`}>
    {props.children}
  </div>
)

const Footer = (props) => (
  <div className={`modal-footer ${props.className || ''}`}>
    {props.children}
  </div>
)
export const Modal = {
  ...createComponentObject(ModalContainer, 'modal'),
  Header,
  Body,
  Footer
}
