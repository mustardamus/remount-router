const path = require('path')
const importFresh = require('import-fresh')
const express = require('express')

const router = express.Router()

module.exports = filePath => {
  return new Promise((resolve, reject) => {
    const resourceName = path.basename(filePath, '.js')
    const controllerObj = importFresh(filePath)
    const routes = Object.keys(controllerObj).map(fullRoute => {
      let [verb, route] = fullRoute.split(' ')
      const routerFunc = router[verb.toLowerCase()]

      if (typeof routerFunc === 'undefined') {
        return reject({
          filePath,
          fullRoute,
          message: `Unknown verb '${verb}'`
        })
      }

      if (!route || route.length === 0) {
        return reject({
          filePath,
          fullRoute,
          message: `Missing route for verb '${verb}'`
        })
      }

      if (route.substr(0, 1) !== '/') {
        return reject({
          filePath,
          fullRoute,
          message: `Route '${route}' must start with an /`
        })
      }

      let handlers = controllerObj[fullRoute]

      if (typeof handlers !== 'function' && !Array.isArray(handlers)) {
        return reject({
          filePath,
          fullRoute,
          message: 'Handlers must be either a single function or an array of functions'
        })
      }

      if (typeof handlers === 'function') {
        handlers = [handlers]
      }

      return { verb, route, handlers }
    })

    resolve({ filePath, resourceName, routes })
  })
}
