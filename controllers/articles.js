'use strict'
const path = require('path')

module.exports = function (app) {
  const currentControllerName = path.basename(__filename, '.js')

  app.locals.debug && console.debug(`Loading ${currentControllerName} controller`)

  return {
    index: function (req, res, next) {
      res.locals.articles = app.locals.models[currentControllerName].all()
      return next()
    },
    show: function (req, res, next) {
      res.locals.article = app.locals.models[currentControllerName].find(req.params.id)
      res.locals.articles = app.locals.models[currentControllerName].all()
      return next()
    }
  }
}