const path = require('path')
const chokidar = require('chokidar')
const parseControllers = require('./parse-controllers')
const buildRouter = require('./build-router')

module.exports = (options, cb = () => {}) => {
  const pathGlob = path.join(options.controllersPath, options.controllersGlob)
  const watcher = chokidar.watch(pathGlob, { ignoreInitial: true })

  watcher.on('all', (eventName, filePath) => {
    options.expressAppInstance._router.stack.forEach(route => {
      if (route.name === 'router' && route.regexp.test(options.apiEndpoint)) {
        parseControllers(options)
          .then(controllers => {
            route.handle = buildRouter(controllers)

            const controller = controllers
              .filter(c => c.filePath === filePath)
              .map(c => Object.assign(c, { eventName }))

            cb(null, controller[0])
          })
          .catch(err => {
            err.eventName = eventName
            cb(err)
          })
      }
    })
  })

  return watcher
}
