const path = require('path')
const test = require('tape')
const parseController = require('../lib/parse-controller')

test('parse-controller', t => {
  const filePathValid = path.join(__dirname, 'parse-controller-fixture-valid.js')
  const filePathInvalid1 = path.join(__dirname, 'parse-controller-fixture-invalid1.js')
  const filePathInvalid2 = path.join(__dirname, 'parse-controller-fixture-invalid2.js')
  const filePathInvalid3 = path.join(__dirname, 'parse-controller-fixture-invalid3.js')
  const filePathInvalid4 = path.join(__dirname, 'parse-controller-fixture-invalid4.js')

  parseController(filePathValid).then(controller => {
    t.ok(controller)
    t.equal(controller.filePath, filePathValid)
    t.equal(controller.resourceName, 'parse-controller-fixture-valid')
    t.ok(Array.isArray(controller.routes))
    t.equal(controller.routes.length, 3)

    t.equal(controller.routes[0].verb, 'GET')
    t.equal(controller.routes[0].route, '/')
    t.ok(Array.isArray(controller.routes[0].handlers))
    t.equal(controller.routes[0].handlers.length, 1)
    t.ok(controller.routes[0].handlers[0]())

    t.equal(controller.routes[2].verb, 'PATCH')
    t.equal(controller.routes[2].route, '/posts/:id')
    t.ok(Array.isArray(controller.routes[2].handlers))
    t.equal(controller.routes[2].handlers.length, 2)
    t.equal(controller.routes[2].handlers[0](), 'middleware')
    t.ok(controller.routes[2].handlers[1]())
  })

  parseController(filePathInvalid1).catch(err => {
    t.ok(err)
    t.equal(err.filePath, filePathInvalid1)
    t.equal(err.fullRoute, 'NOVALIDVERB /')
    t.equal(err.message, `Unknown verb 'NOVALIDVERB'`)
  })

  parseController(filePathInvalid2).catch(err => {
    t.ok(err)
    t.equal(err.message, `Missing route for verb 'GET'`)
  })

  parseController(filePathInvalid3).catch(err => {
    t.ok(err)
    t.equal(err.message, `Route 'posts' must start with an /`)
  })

  parseController(filePathInvalid4).catch(err => {
    t.ok(err)
    t.equal(err.message, 'Handlers must be either a single function or an array of functions')
  })

  t.end()
})
