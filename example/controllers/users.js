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
