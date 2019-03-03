import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { StepGroup } from './StepGroup'
import { OptionList } from './OptionList'
import { Cart } from './Cart'
const pathList = [
  '/store/pocketCategories',
  '/store/pockets',
  '/store/straws',
  '/store/brushes',
  '/store/cart'
]
export default class Store extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 'pocket',
      pocketStep: 'category',
      category: '',
      pocket: ''
    }
    this.redirect = this.redirect.bind(this)
  }
  redirect (incrementation) {
    let newIndex = pathList.indexOf(window.location.pathname) + incrementation
    if (newIndex === 1 && incrementation === 1) newIndex++
    if (newIndex === 1 && incrementation === -1) newIndex--
    this.props.global.history.push(pathList[newIndex])
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.setNav)
  }
  filterArticleList () {
    if (!this.state.category || this.state.category.en === 'All') {
      return this.props.global.pocketList
    } else {
      return this.props.global.pocketList.filter(article => (
        article.category === this.state.category._id
      ))
    }
  }
  increment (item, type, index, incrementation) {
    const list = this.props.global[type].slice()
    if (index === undefined) list.push({ ...item, buyCount: 1 })
    else list[index].buyCount = list[index].buyCount + incrementation
    if (incrementation === -1 && !list[index].buyCount) list.splice(index, 1)
    this.props.global.setState({ [type]: list })
    window.localStorage.setItem(type, JSON.stringify(list))
  }
  render () {
    return (
      <div id='store'>
        <StepGroup
          global={this.props.global}
          stepList={[
            { label: 'pockets', path: '/store/pocketCategories' },
            { label: 'straws', path: '/store/straws' },
            { label: 'brushes', path: '/store/brushes' },
            { label: 'cart', path: '/store/cart' }
          ]}
        />
        <div className='store-container'>
          {(window.location.pathname !== '/store/pocketCategories' &&
          !(window.location.pathname === '/store/cart' &&
          window.innerWidth < 800)
          ) &&
            <span className='back' onClick={() => this.redirect(-1)}>
              <i className='far fa-angle-left' />
              {this.props.global.say.back}
            </span>
          }
          <Switch>
            <Route path='/store/pocketCategories' render={() => (
              <OptionList
                global={this.props.global}
                onClick={(item) => {
                  this.setState({ category: item })
                  this.props.global.history.push('/store/pockets')
                }}
                title={(item) => item[this.props.global.lang]}
                list={this.props.global.categoryList}
              />
            )} />
            <Route path='/store/pockets' render={() => (
              <OptionList
                global={this.props.global}
                onClick={(item) => this.props.global.setState({ modal: 'Article', modalProps: item })}
                title={(item) => item[this.props.global.lang].name}
                badge={(item) => `${item.count} ${this.props.global.say.stock}`}
                list={this.filterArticleList()}
                onPlus={(item, index) => this.increment(item, 'selectedPocketList', index, 1)}
                onMinus={(item, index) => this.increment(item, 'selectedPocketList', index, -1)}
                selectedList={this.props.global.selectedPocketList}
              />
            )} />
            <Route path='/store/straws' render={() => (
              <OptionList
                global={this.props.global}
                onClick={(item) => this.props.global.setState({ modal: 'Article', modalProps: item })}
                title={(item) => item[this.props.global.lang].name}
                badge={(item) => `${item.count} ${this.props.global.say.stock}`}
                list={this.props.global.brushList}
                onPlus={(item, index) => this.increment(item, 'selectedBrushList', index, 1)}
                onMinus={(item, index) => this.increment(item, 'selectedBrushList', index, -1)}
                selectedList={this.props.global.selectedBrushList}
              />
            )} />
            <Route path='/store/brushes' render={() => (
              <OptionList
                global={this.props.global}
                onClick={(item) => this.props.global.setState({ modal: 'Article', modalProps: item })}
                title={(item) => item[this.props.global.lang].name}
                badge={(item) => `${item.count} ${this.props.global.say.stock}`}
                list={this.props.global.strawList}
                onPlus={(item, index) => this.increment(item, 'selectedStrawList', index, 1)}
                onMinus={(item, index) => this.increment(item, 'selectedStrawList', index, -1)}
                selectedList={this.props.global.selectedStrawList}
              />
            )} />

            <Route path='/store/cart' render={() => (
              <Cart
                global={this.props.global}
                onPlus={(item, index, type) => this.increment(item, type, index, 1)}
                onMinus={(item, index, type) => this.increment(item, type, index, -1)}
              />
            )} />
            <Redirect exact from='/store' to='/store/pocketCategories' />
          </Switch>
          {window.location.pathname !== '/store/cart' &&
            <span className='next' onClick={() => this.redirect(1)}>
              {this.props.global.say.next}
              <i className='far fa-angle-right' />
            </span>
          }
        </div>
      </div>
    )
  }
}
