import React from 'react'

export default function renderPublishedAsList () {
  return this.props.global.myRoleList.map((obj) => ({
    value: (<React.Fragment>
      <div className='img' style={{ backgroundImage: `url('images/${obj.img}.jpg')` }} />
      <p>{obj.title}</p>
      {this.state.publishedAs === obj._id && <i className='far fa-check' />}
    </React.Fragment>),
    onClick: () => this.setState({ publishedAs: obj._id })
  }))
}
