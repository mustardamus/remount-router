const path = require('path')
const test = require('tape')
const buildOptions = require('../lib/build-options')

test('build-options', t => {
  const defaults = {
    isDev: true,
    controllersPath: path.join(process.cwd(), 'controllers'),
    controllersGlob: '*.js',
    apiEndpoint: '/api',
    expressAppInstance: null
  }

  t.deepEqual(buildOptions(), defaults)

  const custom = buildOptions({
    isDev: false,
    controllersPath: '/'
  })

  t.equal(custom.isDev, false)
  t.equal(custom.controllersPath, '/')
  t.equal(custom.apiEndpoint, '/api')

  process.env.NODE_ENV = 'production'
  t.equal(buildOptions().isDev, false)
  process.env.NODE_ENV = 'test'

  t.end()
})
