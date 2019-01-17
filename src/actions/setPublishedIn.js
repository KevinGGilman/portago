
export default function setPublishedIn (value) {
  let index = this.state.publishedIn.indexOf(value)
  let { publishedIn } = this.state
  if (index > -1 && publishedIn.length > 1) {
    publishedIn.splice(index, 1)
  } else if (value === 'all' ||
  (index === -1 && publishedIn.length === this.props.global.comiteList.length - 1)) {
    publishedIn = ['all']
  } else if (index === -1) {
    publishedIn.push(value)
  }
  if (publishedIn.includes('all') && publishedIn.length > 1) {
    index = publishedIn.indexOf('all')
    publishedIn.splice(index, 1)
  }
  this.setState({ publishedIn })
}
