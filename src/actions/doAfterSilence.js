import moment from 'moment'
export default async function doAfterSilence (milliseconds, callback) {
  const callbackTrigger = async (milliseconds, callback) => {
    const timeBeforeNow = moment().subtract(milliseconds, 'milliseconds')
    const isSilence = !timeBeforeNow.isBefore(this.state.currentTime)
    if (isSilence) callback()
  }

  this.setState({ currentTime: moment() })
  await setTimeoutPromise(milliseconds)
  callbackTrigger(milliseconds, callback)
}

function setTimeoutPromise (milliseconds) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), milliseconds))
}
