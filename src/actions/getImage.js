import anonym from '../images/anonym.svg'
import user from '../images/user.svg'
import group from '../images/group.svg'
const imageMap = { anonym, user, group }
export default function getImage (image) {
  if (imageMap[image.url]) return imageMap[image.url]
  else return image.url
}
