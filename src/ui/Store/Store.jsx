import React from 'react'

import { StepGroup } from './StepGroup'
import { OptionList } from './OptionList'
import { Cart } from './Cart'

export default class Store extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 'pocket',
      pocketStep: 'category',
      category: '',
      pocket: '',
      selectedPocketList: [],
      selectedStrawList: [],
      selectedBrushList: []
    }
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
    const list = this.state[type].slice()
    if (index === undefined) list.push({ ...item, buyCount: 1 })
    else list[index].buyCount = list[index].buyCount + incrementation
    if (index && list[index].buyCount === 0) list.splice(index, 1)
    this.setState({ [type]: list })
  }
  render () {
    return (
      <div id='store'>
        <StepGroup
          global={this.props.global}
          value={this.state.step}
          stepList={['pocket', 'straw', 'brush']}
          onChange={(step) => this.setState({ step })}
        />
        <OptionList
          onClick={(item) => this.setState({ pocketStep: 'items', category: item })}
          title={(item) => item[this.props.global.lang]}
          isOpen={this.state.step === 'pocket' && this.state.pocketStep === 'category'}
          list={this.props.global.categoryList}
        />
        <OptionList
          onBack={() => this.setState({ pocketStep: 'category', category: undefined })}
          onNext={(step) => this.setState({ step: 'straw' })}
          onClick={(item) => this.props.global.setState({ modal: 'Article', modalProps: item })}
          isOpen={this.state.step === 'pocket' && this.state.pocketStep === 'items'}
          title={(item) => item[this.props.global.lang].name}
          badge={(item) => `${item.count} ${this.props.global.say.stock}`}
          list={this.filterArticleList()}
          onPlus={(item, index) => this.increment(item, 'selectedPocketList', index, 1)}
          onMinus={(item, index) => this.increment(item, 'selectedPocketList', index, -1)}
          selectedList={this.state.selectedPocketList}
        />
        <OptionList
          onBack={(step) => this.setState({ step: 'pocket' })}
          onNext={(step) => this.setState({ step: 'brush' })}
          onClick={(item) => this.props.global.setState({ modal: 'Article', modalProps: item })}
          isOpen={this.state.step === 'straw'}
          title={(item) => item[this.props.global.lang].name}
          badge={(item) => `${item.count} ${this.props.global.say.stock}`}
          list={this.props.global.strawList}
          onPlus={(item, index) => this.increment(item, 'selectedStrawList', index, 1)}
          onMinus={(item, index) => this.increment(item, 'selectedStrawList', index, -1)}
          selectedList={this.state.selectedStrawList}
        />
        <OptionList
          onBack={(step) => this.setState({ step: 'straw' })}
          onNext={(step) => this.setState({ step: 'brush' })}
          onClick={(item) => this.props.global.setState({ modal: 'Article', modalProps: item })}
          isOpen={this.state.step === 'brush'}
          title={(item) => item[this.props.global.lang].name}
          badge={(item) => `${item.count} ${this.props.global.say.stock}`}
          list={this.props.global.brushList}
          onPlus={(item, index) => this.increment(item, 'selectedBrushList', index, 1)}
          onMinus={(item, index) => this.increment(item, 'selectedBrushList', index, -1)}
          selectedList={this.state.selectedBrushList}
        />
        <Cart {...this.state} global={this.props.global} />
      </div>
    )
  }
}
