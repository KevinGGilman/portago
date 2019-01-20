import React from 'react'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import { Emoji } from './Emoji'
import { highlight, quote, sub, exp, underline, italic, bold } from '../other/icons'
import { Editor, EditorState, RichUtils } from 'draft-js'
export default class RichEditor extends React.Component {
  constructor (props) {
    super(props)
    const value = this.props.value
    if (value !== '') {
      const state = stateFromHTML(value)
      this.state = {
        editorState: EditorState.createWithContent(state),
        showURLInput: false,
        urlValue: '',
        isCollapsed: true,
        highlightCoords: {},
        title: ''
      }
    } else {
      this.state = { editorState: EditorState.createEmpty() }
    }
    this.focus = () => this.refs.editor.focus()
    this.onChange = (editorState) => {
      const isCollapsed = editorState.getSelection().isCollapsed()
      this.setState({ editorState, isCollapsed }, () => {
        this.setState({ highlightCoords: this.getSelectionCoords() })
      })
      let html = stateToHTML(editorState.getCurrentContent())
      this.props.onChange(html, editorState.getCurrentContent().getPlainText())
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.handleKeyCommand = (command) => this._handleKeyCommand(command)
    this.toggleBlockType = (type) => this._toggleBlockType(type)
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style)
  }
  componentDidMount () {
    document.getElementsByClassName('RichEditor-root')[0].addEventListener('scroll', this.handleScroll)
  }
  handleScroll () {
    if (!this.state.isCollapsed) this.setState({ highlightCoords: this.getSelectionCoords() })
  }
  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScroll)
  }
  _handleKeyCommand (command) {
    const { editorState } = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }
  getSelectionCoords (win) {
    win = win || window
    var doc = win.document
    var sel = doc.selection
    var range
    var rects
    var rect
    var x = 0
    var y = 0
    if (sel) {
      if (sel.type !== 'Control') {
        range = sel.createRange()
        range.collapse(true)
        x = range.boundingLeft
        y = range.boundingTop
      }
    } else if (win.getSelection) {
      sel = win.getSelection()
      if (sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange()
        if (range.getClientRects) {
          range.collapse(true)
          rects = range.getClientRects()
          if (rects.length > 0) {
            rect = rects[0]
          }
          if (!rect) return
          x = rect.left
          y = rect.top
        }
        // Fall back to inserting a temporary element
        if (Number(x) === 0 && Number(y) === 0) {
          var span0 = doc.createElement('span')
          var span1 = doc.createElement('span')
          if (span0.getClientRects) {
            span0.appendChild(doc.createTextNode('\u200b'))
            span1.appendChild(doc.createTextNode('\u200b'))
            range.insertNode(span0)
            rect = span0.getClientRects()[0]
            x = rect.left
            y = rect.top
            var spanParent = span0.parentNode
            spanParent.removeChild(span0)

            // Glue any broken text nodes back together
            spanParent.normalize()
          }
        }
      }
    }
    if (x + 400 > window.innerWidth) return { right: 40, top: y - 40 }
    return { left: x, top: y - 40 }
  }
  _toggleBlockType (blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    )
  }

  _toggleInlineStyle (inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    )
  }

  componentDidUpdate (oldProps) {
    if (oldProps.loadContent !== this.props.loadContent) {
      let state = stateFromHTML(this.props.loadContent || '')
      let eState = EditorState.createWithContent(state)
      this.setState({
        editorState: eState,
        showURLInput: false,
        urlValue: '',
        isCollapsed: true
      })
    }
  }
  render () {
    const { editorState } = this.state
    var contentState = editorState.getCurrentContent()
    // const isValue = contentState.hasText();
    // const isError = (this.props.isValidation && !isValue);
    let className = 'RichEditor-editor'
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder'
      }
    }
    return (
      <div className='RichEditor-root'>
        {(!this.state.isCollapsed && this.state.isFocus) &&
          <div className='controls' style={this.state.highlightCoords}>
            <BlockStyleControls
              global={this.props.global}
              editorState={editorState}
              onToggle={this.toggleBlockType}
            />
            <InlineStyleControls
              editorState={editorState}
              state={this.state}
              onToggle={this.toggleInlineStyle}
            />
          </div>
        }
        <div className='editor-box'>
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              customStyleMap={styleMap}
              onFocus={() => this.setState({ isFocus: true })}
              onBlur={() => this.setState({ isFocus: false })}
              placeholder={this.props.placeholder}
              ref='editor'
              spellCheck
            />
          </div>
          {!this.props.disableEmoji &&
            <i
              className='far fa-smile-plus'
              onClick={() => this.setState({ isEmoji: true })}
            >
              {this.state.isEmoji &&
                <Emoji
                  {...this.props}
                  setState={(obj) => this.setState(obj)}
                  editorState={editorState}
                />
              }
            </i>
          }
        </div>
      </div>
    )
  }
}

// Custom overrides for "code" style.
const styleMap = {
  SUPERSCRIPT: {
    verticalAlign: 'super'
  },
  SUBSCRIPT: {
    verticalAlign: 'sub'
  },
  MARK: {
    backgroundColor: 'yellow'
  }
}

function getBlockStyle (block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote'
    default: return null
  }
}

class StyleButton extends React.Component {
  constructor () {
    super()
    this.onToggle = (e) => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render () {
    let className = 'RichEditor-styleButton'
    if (this.props.active) {
      className += ' RichEditor-activeButton'
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
  }
}

const BlockStyleControls = (props) => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  const BLOCK_TYPES = [
    { label: <span>T1</span>, style: 'header-three' },
    { label: <span>T2</span>, style: 'header-four' },
    { label: <i className='far fa-list-ol' />, style: 'ordered-list-item' },
    { label: <i className='far fa-list-ul' />, style: 'unordered-list-item' },
    { label: quote, style: 'blockquote' },
    { label: <i className='far fa-code' />, style: 'code-block' }
  ]
  return (
    <div className='RichEditor-controls'>
      {BLOCK_TYPES.map((type, i) =>
        <StyleButton
          key={i}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  )
}

var INLINE_STYLES = [
  { label: bold, style: 'BOLD' },
  { label: italic, style: 'ITALIC' },
  { label: underline, style: 'UNDERLINE' },
  { label: sub, style: 'SUBSCRIPT' },
  { label: exp, style: 'SUPERSCRIPT' },
  { label: highlight, style: 'MARK' }
]

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div className='RichEditor-controls inline'>
      {INLINE_STYLES.map((type, index) =>
        <StyleButton
          key={index}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  )
}
