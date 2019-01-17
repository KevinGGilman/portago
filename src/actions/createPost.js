export default function createPost () {
  if (
    !this.state.textContent.length || (!this.state.title.length && (
      this.state.forceTitle || this.state.textContent > 150
    ))
  ) return
  this.getComiteId = this.props.global.do.getComiteId.bind(this)
  let query = {
    content: this.state.htmlContent,
    publishedAs: this.state.publishedAs,
    comite: this.getComiteId(this.state.publishedIn),
    group: this.props.global.group._id
  }
  if (this.state.imageList.length) query.imageList = this.state.imageList
  if (this.state.featureList.length) query.featureList = this.state.featureList
  if (this.state.title.length) query.title = this.state.title
  this.props.onCreate(query)
}
