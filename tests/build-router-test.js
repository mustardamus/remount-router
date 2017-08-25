const test = require('tape')
const express = require('express')
const request = require('supertest')
const buildOptions = require('../lib/build-options')
const parseControllers = require('../lib/parse-controllers')
const buildRouter = require('../lib/build-router')

test('parse-controllers', t => {
  parseControllers(buildOptions({
    controllersPath: __dirname,
    controllersGlob: '*-fixture-valid.js'
  })).then(controllers => {
    t.ok(controllers)

    const router = buildRouter(controllers)

    t.equal(typeof router, 'function')
    t.equal(typeof router.get, 'function')

    const app = express()

    app.use('/api', router)

    request(app)
      .get('/api/parse-controller-fixture-valid')
      .expect(200)
      .end((err, res) => {
        t.notOk(err)
        t.deepEqual(res.body, { works: true })

        request(app)
          .patch('/api/parse-controller-fixture-valid/posts/1')
          .expect(200)
          .end((err, res) => {
            t.notOk(err)
            t.deepEqual(res.body, { works: true })

            t.end()
          })
      })
  })
})
