import React from 'react'

export default function renderPublishedInList () {
  return this.props.global.comiteList.map((comite) => ({
    value: (<React.Fragment>
      <p>{comite.name}</p>
      {this.state.publishedIn.includes(comite._id) && <i className='far fa-check' />}
    </React.Fragment>),
    onClick: () => this.setPublishedIn(comite._id),
    noClose: 'true'
  }))
}
