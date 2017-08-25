const test = require('tape')
const buildOptions = require('../lib/build-options')
const parseControllers = require('../lib/parse-controllers')

test('parse-controllers', t => {
  parseControllers(buildOptions({
    controllersPath: __dirname,
    controllersGlob: '*-fixture-valid.js'
  })).then(controllers => {
    t.ok(Array.isArray(controllers))
    t.equal(controllers.length, 1)
    t.equal(controllers[0].resourceName, 'parse-controller-fixture-valid')
  })

  parseControllers(buildOptions({
    controllersPath: __dirname,
    controllersGlob: '*-fixture-invalid*.js'
  })).catch(err => {
    t.ok(err)
  })

  t.end()
})
