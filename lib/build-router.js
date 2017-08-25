const express = require('express')

module.exports = controllers => {
  const router = express.Router()

  controllers.forEach(controller => {
    controller.routes.forEach(route => {
      const routerFunc = router[route.verb.toLowerCase()]
      const url = `/${controller.resourceName}${route.route}`

      routerFunc.apply(router, [url, ...route.handlers])
    })
  })

  return router
}
