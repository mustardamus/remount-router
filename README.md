# remount-router

A simple file-based router for [Express.js](https://expressjs.com) with
automatic routes remounting on file changes without the need to restart the
server.

![Quick Demo](https://i.imgur.com/84AzFCR.gif)


## Installation

```bash
npm install remount-router --save
```

or

```bash
yarn add remount-router
```


## Initialization

The `remount-router` comes as middleware and takes a couple of options. Take
this example server for instance:

```javascript
const path = require('path')
const express = require('express')
const remountRouter = require('remount-router')

const app = express()

app.use(remountRouter({
  expressAppInstance: app,
  apiEndpoint: '/api',
  controllersPath: path.join(__dirname, 'controllers')
}))

app.listen(17777)
```

This will parse all `*.js` files in the `./controllers` directory and mounts it
to the `/api` endpoint.


## Controllers

The name of a controller file will be used as the parent route. Controllers must
export an `Object`, the keys define the HTTP verb and the route. Each verb/route
can have one `Function` or an `Array` of `Function`s.

Let's take the controller file `./controllers/users.js` for example:

```javascript
module.exports = {
  'GET /' (req, res) {
    res.json({ action: 'find all users' })
  },

  'POST /admin/:id': [
    (req, res, next) => {
      // middleware to be executed before the route function
      next()
    },

    (req, res) => {
      res.json({ action: 'save a new user' })
    }
  ]
}
```

This will result in two routes: `GET /api/users` and
`POST /api/users/admin/:id`. Note that you can use middleware if you pass an
`Array` to the verb/route key.

The verb (`GET`, `POST`, `PUT`, etc.) can be any
[routing method](https://expressjs.com/en/4x/api.html#app.METHOD) offered by
Express.js (`app.get()`, `app.post()`, `app.put()`, etc.).


## Automatic Route Remounting

If the option `isDev` is `true`, all matching controller files will be watched
for changes (adding/removing files, editing files). If a change is detected, a
new router is generated and remounted to the `apiEndpoint`.


## Options

Options are passed to `remount-router` as an `Object` (as seen in the
initialization example).

```javascript
const defaults = {
  expressAppInstance: null,
  controllersPath: path.join(process.cwd(), 'controllers'),
  controllersGlob: '*.js',
  apiEndpoint: '/api',
  isDev: !(process.env.NODE_ENV === 'production')
}
```

### `expressAppInstance` (required)

The instance of your main app created with `express()`. This is used to
initially mount the router. But more importantly, it is used to remount the
router (there is no other way than passing it as an option).

### `controllersPath`

Where to find controller files to parse. Note that the default is pointing to
the `controllers` directory in the current working directory. This is convenient
to quickly get started, but the `process.cwd()` might change when you deploy to
another system. Therefor it is advised to overwrite this option with an absolute
path (as seen in the initialization example).

### `controllersGlob`

This defaults to `*.js` and is consumed by the
[Glob](https://github.com/isaacs/node-glob)
module. Set this option if you do not have controllers only in the controllers
directory. You might have `*.test.js` files along the controllers, then you
would exclude them by overwriting this option with `*!(.test).js`.

### `apiEndpoint`

This defaults to `/api` and is the endpoint where the router is mounted and all
sub-routes parsed from the controllers will be mounted on. Remember, a
controller named `./controllers/posts.js` with a route key `GET /all` will
result in the `GET` route `/api/posts/all`.

### `isDev`

This defaults to `true` if the `NODE_ENV` environment variable is not
`production`, otherwise it is `false`. File watching and route remounting will
only happen if this option is `true`.


## Using it with Nuxt.js

Implementing `remount-router` in [Nuxt.js](https://nuxtjs.org/) is super simple.
After you've installed the module (`yarn add remount-router`), add it to your
`nuxt.config.js` as a module like so:

```javascript
module.exports = {
  modules: [
    'remount-router/nuxt'
  ]
}
```

Notice that we don't pass any options: the `expressAppInstance` is created for
you, and the `controllersPath` is set to `/controllers` inside Nuxt's `srcDir`.

However, you can pass custom options like so:

```javascript
module.exports = {
  modules: [
    ['remount-router/nuxt', {
      controllersGlob: '*!(.test).js',
      apiEndpoint: '/api/v1'
    }]
  ]
}
```


## Development

```bash
yarn
yarn test
```


## Changelog

- 2017-08-29: Add Nuxt.js module wrapper
- 2017-08-25: Initial release


## License

Copyright 2017 Sebastian Senf ([enkrateia.me](https://enkrateia.me))

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
