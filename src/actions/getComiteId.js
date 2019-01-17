export default function getComiteId (comite = this.props.global.comite) {
  const { global } = this.props
  if (comite === 'all' || comite[0] === 'all') return global.comiteList.map((obj) => obj._id).slice(1)
  else return comite
}
