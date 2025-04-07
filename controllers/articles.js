'use strict'
const path = require('path')

const sortByCreatedAt = function (a, b) {
  const aCreatedAt = Date.parse(a.createdAt)
  const bCreatedAt = Date.parse(b.createdAt)
  return bCreatedAt - aCreatedAt
}

const sortByTitle = function (a, b) {
  const aTitle = a.title.toLowerCase()
  const bTitle = b.title.toLowerCase()
  return aTitle.localeCompare(bTitle)
}

const filterByTag = function (article, tag) {
  return article.tags && article.tags.includes(tag)
}

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
      return next()
    }
  }
}