import React from 'react'
import { Navigation } from '../ui/Form'

export default function renderFeatureList () {
  return ([
    {
      value: <><i className='far fa-images' /> Images</>,
      onClick: () => this.chooseFile('imageList', true)
    },
    {
      value: (
        <><i className='far fa-paperclip' /> Files</>
      ),
      onClick: () => this.chooseFile('featureList', true)
    },
    {
      value: (
        <><i className='far fa-link' /> Links</>
      ),
      onClick: () => this.setState({ toggleList: [true, false] })
    },
    {
      value: (
        <><i className='far fa-map-marker-alt' /> Locations</>
      ),
      onClick: () => this.setState({ toggleList: [false, true] })
    },
    {
      value: (
        <><i className='far fa-pencil' /> Title</>
      ),
      onClick: () => this.setState({ forceTitle: !this.state.forceTitle })
    },
    { value: '' },
    {
      value: (
        <Navigation isSubMenu optionList={this.renderPublishedAsList()}>
          <i className='fas fa-user' /> Published As
        </Navigation>
      ),
      isSubMenu: 'true',
      onClick: () => {}
    },
    {
      value: (
        <Navigation isSubMenu optionList={this.renderPublishedInList()}>
          <i className='fas fa-users' /> Published in
        </Navigation>
      ),
      isSubMenu: 'true',
      onClick: () => {}
    }
  ])
}
