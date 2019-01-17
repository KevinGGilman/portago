import moment from 'moment'

export default function getDate (date, isExact) {
  date = moment(date)
  const today = moment()
  const days = today.diff(date, 'days')
  const years = today.diff(date, 'years', true)
  if (years > 0.5) return date.format('MMMM D YYYY - HH:mm')
  else if (days > 6) return date.format('MMMM D - HH:mm')
  else if (days > 1) return date.format('dddd - HH:mm')
  if (isExact) return date.format('HH:mm')
  else return date.fromNow()
}
