export default function chooseFile (type, isMultiple) {
  const accept = type.includes('image') ? 'image/*' : 'file'
  this.fileSelector = document.createElement('input')
  this.fileSelector.setAttribute('type', 'file')
  if (isMultiple) this.fileSelector.setAttribute('multiple', 'multiple')
  this.fileSelector.setAttribute('accept', accept)
  this.fileSelector.click()
  this.action = isMultiple ? pushFiles : setFile
  this.action = this.action.bind(this)
  return new Promise(async (resolve) => {
    this.fileSelector.addEventListener('change', async (evt) => {
      const file = await this.action(evt, type)
      resolve(file)
    })
  })
}

async function setFile (evt, type) {
  const path = evt.path || evt.composedPath()
  let file = path[0].files[0]
  return getFileDetails(file, type.includes('image'))
}

async function pushFiles (evt, type) {
  const path = evt.path || evt.composedPath()
  let newFiles = Array.from(path[0].files)
  const isImage = this.pushFiles.type.includes('image')
  newFiles = await Promise.all(newFiles.map(async (newFile) => {
    return getFileDetails(newFile, isImage)
  }))
  return newFiles
}
function convertFile (file, type) {
  const reader = new window.FileReader()
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort()
      reject(new Error('error on file upload'))
    }
    reader.onload = () => {
      if (type === 'image') resolve(reader.result)
      else resolve(new Uint8Array(reader.result))
    }
    if (type === 'image') reader.readAsDataURL(file)
    else reader.readAsArrayBuffer(file)
  })
}
async function getFileDetails (file, isImage) {
// convert file to be accessible in a server request
  let url
  let dimmensions
  let data
  if (isImage) {
    url = await convertFile(file, 'image')
    dimmensions = await getImageSize(url)
  } else data = await convertFile(file)

  // get necessary data from blob
  const { name, type, size } = file
  file = { name, type, size }
  if (isImage) file = { ...file, ...dimmensions, url }
  else file.data = data
  return file
}
function getImageSize (url) {
  return new Promise((resolve, reject) => {
    var image = new window.Image()
    image.onload = () => {
      resolve({ width: image.width, height: image.height })
    }
    image.src = url
  })
}
