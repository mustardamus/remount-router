module.exports = {
  'GET /' (req, res) {
    res && res.status(200).json({ works: true })
    return true
  },

  'POST /post' (req, res) {
    res && res.status(200).json({ works: true })
    return true
  },

  'PATCH /posts/:id': [
    (req, res, next) => {
      next && next()
      return 'middleware'
    },

    (req, res) => {
      res && res.status(200).json({ works: true })
      return true
    }
  ]
}
