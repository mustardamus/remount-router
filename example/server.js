const path = require('path')
const express = require('express')
const remountRouter = require('..')

const app = express()

app.use(remountRouter({
  expressAppInstance: app,
  apiEndpoint: '/api',
  isDev: true,
  controllersPath: path.join(__dirname, 'controllers')
}))

app.listen(17777)
