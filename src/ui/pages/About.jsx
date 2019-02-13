import React from 'react'
import { Editor, EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
export default class About extends React.Component {
  render () {
    return (
      <div id='about'>
        <div className='list'>
          {this.props.global.postList.map((item) => {
            const content = stateFromHTML(item[this.props.global.lang].content)
            return (
              <div className='item'>
                <Editor
                  editorState={EditorState.createWithContent(content)}
                  readOnly
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
