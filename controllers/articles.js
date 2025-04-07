'use strict'
const path = require('path')

module.exports = function (app) {
  const currentControllerName = path.basename(__filename, '.js')

  app.locals.debug && console.debug(`Loading ${currentControllerName} controller`)

  return {
    index: function (req, res) {
      const articlesCollection = app.locals.models[currentControllerName].all()
      res.render('articles/index', { articles: articlesCollection })
    },
    show: function (req, res) {
      const article = app.locals.models[currentControllerName].find(req.params.id)

      if (article) {
        return res.render('articles/show', { article })
      }

      res.status(404).render('errors/404')
    }
  }
}