module.exports = {
  'GET /' (req, res) {
    res.json({ action: 'find all posts' })
  },

  'POST /:id' (req, res) {
    res.json({ action: 'save a new post' })
  }
}
