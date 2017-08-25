const path = require('path')

module.exports = (options = {}) => {
  const defaults = {
    expressAppInstance: null,
    controllersPath: path.join(process.cwd(), 'controllers'),
    controllersGlob: '*.js',
    apiEndpoint: '/api',
    isDev: !(process.env.NODE_ENV === 'production')
  }

  return Object.assign({}, defaults, options)
}
