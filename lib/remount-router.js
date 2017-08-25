const fs = require('fs')
const colors = require('colors')
const buildOptions = require('./build-options')
const parseControllers = require('./parse-controllers')
const buildRouter = require('./build-router')
const watchFiles = require('./watch-files')

const shortFilePath = filePath => {
  return filePath.replace(process.cwd(), '.')
}

const log = message => {
  console.log(colors.grey('[remount-router]'), message)
}

const logError = err => {
  if (err.filePath) {
    const filePath = colors.red(shortFilePath(err.filePath))

    if (err.eventName) {
      log(`${colors.blue(`[${err.eventName}]`)} ${filePath}`)
    } else {
      log(filePath)
    }

    log(colors.yellow(`-> ${err.message}`))
  } else {
    log(colors.red(err))
  }
}

const logController = (options, controller) => {
  const filePath = colors.green(shortFilePath(controller.filePath))

  if (controller.eventName) {
    log(`${colors.blue(`[${controller.eventName}]`)} ${filePath}`)
  } else {
    log(filePath)
  }

  controller.routes.forEach(route => {
    const url = `${options.apiEndpoint}/${controller.resourceName}${route.route}`
    log(colors.yellow(`-> ${route.verb} ${url}`))
  })
}

module.exports = customOptions => {
  const middleware = (res, req, next) => { next() }
  const options = buildOptions(customOptions)

  if (!fs.existsSync(options.controllersPath)) {
    logError(`controllersPath: '${options.controllersPath}' does not exist`)
    return middleware
  }

  if (options.expressAppInstance === null) {
    logError(`expressAppInstance: 'express()' app instance must be passed`)
    return middleware
  }

  parseControllers(options)
    .then(controllers => {
      const router = buildRouter(controllers)

      options.expressAppInstance.use(options.apiEndpoint, router)
      controllers.forEach(controller => logController(options, controller))
    })
    .catch(err => logError(err))

  if (options.isDev) {
    watchFiles(options, (err, controller) => {
      if (err) {
        logError(err)
      } else {
        logController(options, controller)
      }
    })
  }

  return middleware
}
