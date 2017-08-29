const path = require('path')
const express = require('express')
const remountRouter = require('./lib/remount-router')

module.exports = function (moduleOptions) {
  if (typeof this.nuxt === 'undefined') {
    throw new Error('Seems like this is not initialized as a Nuxt.js module')
  }

  const app = express()
  const options = Object.assign({}, {
    expressAppInstance: app,
    isDev: this.options.dev,
    cobtrollersPath: path.join(this.options.srcDir, 'controllers')
  }, moduleOptions)

  app.use(remountRouter(options))
  this.addServerMiddleware({ path: '/', handler: app._router })
}
