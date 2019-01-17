const allJSfilesInFolder = require.context('./', true, /\.js$/)

const exportFiles = allJSfilesInFolder.keys().reduce((list, file) => {
  if (file === './index.js') return list
  list[file.slice(2, -3)] = allJSfilesInFolder(file).default
  return list
}, {})
export default exportFiles
