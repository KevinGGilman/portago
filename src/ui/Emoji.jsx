import React from 'react'
import { Modifier, EditorState, SelectionState } from 'draft-js'
export class Emoji extends React.Component {
  constructor (props) {
    super(props)
    this.state = { minEmojiIndex: 0, length: [...Array(97)] }
    this.goTo = this.goTo.bind(this)
    this.onWindowClick = this.onWindowClick.bind(this)
  }
  add (emoji) {
    const { editorState } = this.props
    if (!editorState) return this.props.onChange(emoji)
    const contentState = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    let newContentState = selection.isCollapsed()
      ? Modifier.insertText(contentState, selection, emoji)
      : Modifier.replaceText(contentState, selection, emoji)
    const newEditorState = EditorState.createWithContent(newContentState)
    const selection1 = new SelectionState({
      anchorKey: selection.getStartKey(),
      anchorOffset: selection.getEndOffset() + emoji.length,
      focusKey: selection.getFocusKey(),
      focusOffset: selection.getFocusOffset() + emoji.length
    })
    this.props.setState({ editorState: EditorState.forceSelection(newEditorState, selection1) })
  }
  componentDidMount () {
    this.hasFirstClick = false
    window.addEventListener('click', this.onWindowClick)
  }
  componentWillUnmount () {
    window.removeEventListener('click', this.onWindowClick)
  }
  onWindowClick (evt) {
    if (this.hasFirstClick) this.props.setState({ isEmoji: false })
    this.hasFirstClick = true
  }
  getParent () {

  }
  goTo (evt, obj) {
    this.setState({
      minEmojiIndex: obj.index,
      length: [...Array(obj.length)]
    })
  }

  render () {
    return (
      <div id='emoji' className='dropdown' onClick={(evt) => evt.stopPropagation()}>
        <div className='scroll-box' ref={(ref) => { this.scrollBoxRef = ref }}>
          {this.state.length.map((v, index) => {
            const emojiIndex = this.state.minEmojiIndex + index
            return (
              <span
                key={emojiIndex}
                id={`emoji${emojiIndex}`}
                onClick={(evt) => this.add(emojiList[emojiIndex])}
              >{emojiList[emojiIndex]}</span>
            )
          })}
        </div>
        <div className='nav'>
          {emojiSection.map((obj, index) => (
            <span key={obj.name} onClick={(evt) => this.goTo(evt, obj)}>{obj.emoji}</span>
          ))}

        </div>
      </div>
    )
  }
}

export class SmallEmoji extends React.Component {
  componentDidMount () {
    this.hasFirstClick = false
    this.onWindowClick = this.onWindowClick.bind(this)
    window.addEventListener('click', this.onWindowClick)
  }
  componentWillUnmount () {
    window.removeEventListener('click', this.onWindowClick)
  }
  onWindowClick (evt) {
    if (this.hasFirstClick) this.props.setState({ isEmoji: false })
    this.hasFirstClick = true
  }
  render () {
    return (
      <div className='dropdown small-emoji'>
        {['☝️', '🤲', '🎉', '👍', '👎',
          '😂', '😊', '😍', '🤔', '😑',
          '😏', '😲', '🙁', '😢', '😡']
          .map(str => <span key={str} onClick={() => this.props.onChange(str)}>{str}</span>)
        }
      </div>
    )
  }
}

const emojiSection = [
  { name: 'smiley', emoji: '😀', index: 0, length: 97 },
  { name: 'people', emoji: '👶', index: 97, length: 167 },
  { name: 'nature', emoji: '🐶', index: 264, length: 161 },
  { name: 'food', emoji: '🍏', index: 425, length: 91 },
  { name: 'sport', emoji: '⚽️', index: 516, length: 76 },
  { name: 'travel', emoji: '🚗', index: 592, length: 120 },
  { name: 'object', emoji: '⌚️', index: 712, length: 177 },
  { name: 'symbol', emoji: '❤️', index: 889, length: 214 },
  { name: 'flag', emoji: '🏳️‍', index: 1103, length: 252 }
]

export const emojiList = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘',
  '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏',
  '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒',
  '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭',
  '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '😳', '🤪', '😵', '😡', '😠', '😷',
  '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '🤓', '💀',
  '👻', '👽', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
  '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳‍♂️',
  '🧕', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '💂‍♀️', '💂‍♂️', '🕵️‍♀️', '🕵️‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾',
  '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻',
  '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀',
  '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰', '🤵', '👸', '🤴', '🧙‍♀️', '🧙‍♂️', '🧝‍♀️', '🧝‍♂️', '🧛‍♀️',
  '🧛‍♂️', '🧟‍♀️', '🧟‍♂️', '🧞‍♀️', '🧞‍♂️', '🧜‍♀️', '🧜‍♂️', '🧚‍♀️', '🧚‍♂️', '👼', '🤰', '🤱',
  '🙇‍♀️', '🙇‍♂️', '💁‍♀️', '💁‍♂️', '🙅‍♀️', '🙅‍♂️', '🙆‍♀️', '🙆‍♂️', '🙋‍♀️', '🙋‍♂️', '🤦‍♀️',
  '🤦‍♂️', '🤷‍♀️', '🤷‍♂️', '🙎‍♀️', '🙎‍♂️', '🙍‍♀️', '🙍‍♂️', '💇‍♀️', '💇‍♂️', '💆‍♀️', '💆‍♂️',
  '🧖‍♀️', '🧖‍♂️', '💅', '🤳', '💃', '🕺', '🕴', '🚶‍♀️', '🚶‍♂️', '🏃‍♀️', '🏃‍♂️', '👫',
  '💑', '💏', '👪', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', '👩‍👦', '👩‍👧', '👩‍👧‍👦', '👩‍👦‍👦', '👩‍👧‍👧', '👨‍👦',
  '👨‍👧', '👨‍👧‍👦', '👨‍👦‍👦', '👨‍👧‍👧', '🤲', '👐', '🙌', '👏', '🤝', '👍', '👎', '👊', '✊',
  '🤛', '🤜', '🤞', '✌️', '👌', '👈', '👉', '👆', '👇', '☝️', '✋',
  '🤚', '🖐', '🖖', '👋', '🤙', '💪', '✍️', '💍', '💄', '💋', '👂', '👃', '👣',
  '👁', '👀', '🧠', '🗣', '👤', '👥',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷',
  '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥',
  '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐚',
  '🐞', '🐜', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑',
  '🦐', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓',
  '🦍', '🐘', '🦏', '🐪', '🐫', '🦒', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑',
  '🐐', '🦌', '🐕', '🐩', '🐈', '🐓', '🦃', '🕊', '🐇', '🐁', '🐀', '🐿', '🦔',
  '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍',
  '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼',
  '🌻', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏',
  '💫', '⭐️', '🌟', '✨', '⚡️', '☄️', '💥', '🔥', '🌪', '🌈', '☀️', '🌤', '⛅️',
  '🌥', '☁️', '🌦', '🌧', '⛈', '🌩', '🌨', '❄️', '☃️', '⛄️', '🌬', '💨', '💧',
  '💦', '☔️', '☂️', '🌊', '🌫',
  '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍',
  '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌶', '🌽', '🥕', '🥔', '🍠', '🥐',
  '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔',
  '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛',
  '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨',
  '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜',
  '🍯', '🥛', '🍼', '☕️', '🍵', '🥤', '🍶', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢',
  '⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑',
  '🏏', '⛳️', '🏹', '🎣', '🥊', '🥋', '🎽', '⛸', '🥌', '🛷', '🎿', '⛷', '🏂',
  '🏋️‍♂️', '🤼‍♀️', '🤼‍♂️', '🤸‍♀️', '🤸‍♂️', '⛹️‍♀️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾‍♂️', '🏌️‍♀️', '🏌️‍♂️',
  '🏇', '🧘‍♀️', '🏄‍♀️', '🏄‍♂️', '🏊‍♀️', '🏊‍♂️', '🤽‍♀️', '🤽‍♂️', '🚣‍♀️', '🚣‍♂️', '🧗‍♀️', '🧗‍♂️',
  '🚵‍♀️', '🚵‍♂️', '🚴‍♀️', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖', '🏵', '🎗', '🎫',
  '🎟', '🎪', '🤹‍♀️', '🤹‍♂️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎲', '🎯', '🎳', '🎮',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜',
  '🛴', '🚲', '🛵', '🏍', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃',
  '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫',
  '🛬', '🛩', '💺', '🛰', '🚀', '🛸', '🚁', '🛶', '⛵️', '🚤', '🛥', '🛳', '⛴',
  '🚢', '⚓️', '⛽️', '🚧', '🚦', '🚥', '🚏', '🗺', '🗿', '🗽', '🗼', '🏰', '🏯',
  '🏟', '🎡', '🎢', '🎠', '⛲️', '⛱', '🏖', '🏝', '🏜', '🌋', '⛰', '🏔', '🗻',
  '🏕', '⛺️', '🏠', '🏡', '🏘', '🏚', '🏗', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥',
  '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛', '⛪️', '🕌', '🕍', '🕋', '⛩', '🛤',
  '🛣', '🗾', '🎑', '🏞', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙', '🌃',
  '🌌', '🌉', '🌁',
  '⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾',
  '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠',
  '📺', '📻', '🎙', '🎚', '🎛', '⏱', '⏲', '⏰', '🕰', '⌛️', '⏳', '📡', '🔋',
  '🔌', '💡', '🔦', '🕯', '🗑', '🛢', '💸', '💵', '💴', '💶', '💷', '💰', '💳',
  '💎', '⚖️', '🔧', '🔨⚒', '🛠', '⛏', '🔩', '⚙️', '⛓', '🔫', '💣', '🔪', '🗡',
  '⚔️', '🛡', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '💈', '⚗️', '🔭', '🔬', '🕳',
  '💊', '💉', '🌡', '🚽', '🚰', '🚿', '🛁', '🛀', '🛀🏻', '🛀🏼', '🛀🏽', '🛀🏾', '🛀🏿',
  '🔑', '🗝', '🚪', '🛋', '🛏', '🛌', '🖼', '🛍', '🛒', '🎁', '🎈', '🎏', '🎀',
  '🎊', '🎉', '🎎', '🏮', '🎐', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦',
  '🏷', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '📊', '📈',
  '📉', '🗒', '🗓', '📆', '📅', '📇', '🗃', '🗳', '🗄', '📋', '📁', '📂', '🗂',
  '🗞', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🔗',
  '📎', '🖇', '📐', '📏', '📌', '📍', '✂️', '🖊', '🖋', '✒️', '🖌', '🖍', '📝',
  '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓', '🛎',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞', '💓', '💗',
  '💖', '💘', '💝', '💟', '☪️', '☢️', '☣️', '📴', '📳', '🆚', '🆘', '❌', '⭕️',
  '🛑', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵',
  '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱',
  '⚜️', '🔰', '♻️', '✅', '🈯️', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀',
  '💤', '🏧', '🚾', '♿️', '🅿️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻',
  '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒',
  '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟',
  '🔢', '#⃣', '*⃣', '⏏️', '▶️', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮', '⏩', '⏪',
  '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '⏫',
  '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '↕️', '➕', '➖',
  '✖️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝',
  '🔜', '✔️', '➗', '☑️', '🔘', '⚪️', '⚫️', '🔴', '🔵', '🔺', '🔻', '🔸', '🔹',
  '🔶', '🔷', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁‍🗨', '💬', '💭',
  '🗯', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕',
  '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢',
  '🕣', '🕤', '🕥', '🕦', '🕧',
  '🏳️', '🏴', '🏁', '🚩', '🇦🇫', '🇦🇽', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴', '🇦🇮',
  '🇦🇶', '🇦🇬', '🇦🇷', '🇦🇲', '🇦🇼', '🇦🇺', '🇦🇹', '🇦🇿', '🇧🇸', '🇧🇭', '🇧🇩', '🇧🇧', '🇧🇾',
  '🇧🇪', '🇧🇿', '🇧🇯', '🇧🇲', '🇧🇹', '🇧🇴', '🇧🇦', '🇧🇼', '🇧🇷', '🇮🇴', '🇻🇬', '🇧🇳', '🇧🇬',
  '🇧🇫', '🇧🇮', '🇰🇭', '🇨🇲', '🇨🇦', '🇮🇨', '🇨🇻', '🇧🇶', '🇰🇾', '🇨🇫', '🇹🇩', '🇨🇱', '🇨🇳',
  '🇨🇽', '🇨🇨', '🇨🇴', '🇰🇲', '🇨🇬', '🇨🇩', '🇨🇰', '🇨🇷', '🇨🇮', '🇭🇷', '🇨🇺', '🇨🇼', '🇨🇾',
  '🇨🇿', '🇩🇰', '🇩🇯', '🇩🇲', '🇩🇴', '🇪🇨', '🇪🇬', '🇸🇻', '🇬🇶', '🇪🇷', '🇪🇪', '🇪🇹', '🇪🇺',
  '🇫🇰', '🇫🇴', '🇫🇯', '🇫🇮', '🇫🇷', '🇬🇫', '🇵🇫', '🇹🇫', '🇬🇦', '🇬🇲', '🇬🇪', '🇩🇪', '🇬🇭',
  '🇬🇮', '🇬🇷', '🇬🇱', '🇬🇩', '🇬🇵', '🇬🇺', '🇬🇹', '🇬🇬', '🇬🇳', '🇬🇼', '🇬🇾', '🇭🇹', '🇭🇳',
  '🇭🇰', '🇭🇺', '🇮🇸', '🇮🇳', '🇮🇩', '🇮🇷', '🇮🇶', '🇮🇪', '🇮🇲', '🇮🇹', '🇯🇲', '🇯🇵', '🎌',
  '🇯🇪', '🇯🇴', '🇰🇿', '🇰🇪', '🇰🇮', '🇽🇰', '🇰🇼', '🇰🇬', '🇱🇦', '🇱🇻', '🇱🇧', '🇱🇸', '🇱🇷',
  '🇱🇾', '🇱🇮', '🇱🇹', '🇱🇺', '🇲🇴', '🇲🇰', '🇲🇬', '🇲🇼', '🇲🇾', '🇲🇻', '🇲🇱', '🇲🇹', '🇲🇭',
  '🇲🇶', '🇲🇷', '🇲🇺', '🇾🇹', '🇲🇽', '🇫🇲', '🇲🇩', '🇲🇨', '🇲🇳', '🇲🇪', '🇲🇸', '🇲🇦', '🇲🇿',
  '🇲🇲', '🇳🇦', '🇳🇷', '🇳🇵', '🇳🇱', '🇳🇨', '🇳🇿', '🇳🇮', '🇳🇪', '🇳🇬', '🇳🇺', '🇳🇫', '🇰🇵',
  '🇲🇵', '🇳🇴', '🇴🇲', '🇵🇰', '🇵🇼', '🇵🇸', '🇵🇦', '🇵🇬', '🇵🇾', '🇵🇪', '🇵🇭', '🇵🇳', '🇵🇱',
  '🇵🇹', '🇵🇷', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇺', '🇷🇼', '🇼🇸', '🇸🇲', '🇸🇦', '🇸🇳', '🇷🇸', '🇸🇨',
  '🇸🇱', '🇸🇬', '🇸🇽', '🇸🇰', '🇸🇮', '🇬🇸', '🇸🇧', '🇸🇴', '🇿🇦', '🇰🇷', '🇸🇸', '🇪🇸', '🇱🇰',
  '🇧🇱', '🇸🇭', '🇰🇳', '🇱🇨', '🇵🇲', '🇻🇨', '🇸🇩', '🇸🇷', '🇸🇿', '🇸🇪', '🇨🇭', '🇸🇾', '🇹🇼',
  '🇹🇯', '🇹🇿', '🇹🇭', '🇹🇱', '🇹🇬', '🇹🇰', '🇹🇴', '🇹🇹', '🇹🇳', '🇹🇷', '🇹🇲', '🇹🇨', '🇹🇻',
  '🇻🇮', '🇺🇬', '🇺🇦', '🇦🇪', '🇬🇧', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇺', '🇻🇦',
  '🇻🇪', '🇻🇳', '🇼🇫', '🇪🇭', '🇾🇪', '🇿🇲', '🇿🇼'
]
export const emojiSet = emojiList.reduce((set, emoji) => ({ ...set, [emoji]: true }), {})