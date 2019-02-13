// convert an array to a _id mapping
export default function listToMap (list, init = {}) {
  return list.reduce((map, item, index) => (
    { ...map, [item._id]: { ...item, index } }
  ), init)
}
