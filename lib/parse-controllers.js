const path = require('path')
const glob = require('glob')
const parseController = require('./parse-controller')

module.exports = options => {
  return new Promise((resolve, reject) => {
    const pathGlob = path.join(options.controllersPath, options.controllersGlob)

    glob(pathGlob, (err, files) => {
      if (err) {
        return reject(err)
      }

      const promises = files.map(filePath => parseController(filePath))

      Promise.all(promises)
        .then(controllers => resolve(controllers))
        .catch(err => reject(err))
    })
  })
}
