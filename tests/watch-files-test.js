const fs = require('fs-extra')
const path = require('path')
const test = require('tape')
const express = require('express')
const request = require('supertest')
const buildOptions = require('../lib/build-options')
const watchFiles = require('../lib/watch-files')

const tempPath = path.join(__dirname, '../temp')
const controller1Path = path.join(tempPath, 'posts.js')
const controller2Path = path.join(tempPath, 'users.js')
const app = express()
const router = express.Router()
let watcher = null

const controller1 = `
module.exports = {
  'GET /' (req, res) {
    res.json({ works: true })
  }
}`

const controller2 = `
module.exports = {
  'GET /' (req, res) {
    res.json({ works: 'yes' })
  },

  'POST /' (req, res) {
    res.json({ works: true })
  }
}`

app.use('/api', router)

test.onFinish(() => {
  watcher.close()
  fs.removeSync(tempPath)
})

test('watch-files', t => {
  fs.ensureDirSync(tempPath)
  t.ok(fs.pathExistsSync(tempPath))
  fs.writeFileSync(controller1Path, controller1, 'utf8')
  t.ok(fs.existsSync(controller1Path))

  const options = buildOptions({
    controllersPath: tempPath,
    expressAppInstance: app,
    isDev: true,
    apiEndpoint: '/api'
  })

  watcher = watchFiles(options)
  t.ok(watcher)

  request(app)
    .get('/api/posts')
    .expect(200)
    .end((err, res) => {
      t.ok(err, 'initial added controllers are not mounted')

      fs.writeFileSync(controller2Path, controller1, 'utf8')

      setTimeout(() => {
        t.ok(fs.existsSync(controller2Path))

        request(app)
          .get('/api/users')
          .expect(200)
          .end((err, res) => {
            t.notOk(err)

            request(app)
              .post('/api/users')
              .expect(200)
              .end((err, res) => {
                t.ok(err)

                fs.writeFileSync(controller2Path, controller2, 'utf8')

                setTimeout(() => {
                  request(app)
                    .post('/api/users')
                    .expect(200)
                    .end((err, res) => {
                      t.notOk(err)
                      t.deepEqual(res.body, { works: true })
                      t.end()
                    })
                }, 500)
              })
          })
      }, 500)
    })
})
