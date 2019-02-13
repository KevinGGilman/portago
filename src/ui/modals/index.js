const allJSfilesInFolder = require.context('./', true, /\.jsx$/)

const exportFiles = allJSfilesInFolder.keys().reduce((list, file) => {
  if (file === './index.js') return list
  list[file.slice(2, -4)] = allJSfilesInFolder(file).default
  return list
}, {})
export default exportFiles
