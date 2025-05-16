'use strict'
const path = require('path')

module.exports = function (app) {
  const currentControllerName = path.basename(__filename, '.js')

  app.locals.debug && console.debug(`Loading ${currentControllerName} controller`)

  return {
    index: function (req, res, next) {
      if (req.query.tag) {
        res.locals.render.articles = app.locals.cache(`articles-tagged-${req.query.tag}`, function () {
          return app.locals.models[currentControllerName].all(
            function (article) {
              return article.tags && article.tags.includes(req.query.tag)
            }
          )
        })
        res.locals.render.title = `Articles tagged as: ${req.query.tag}' (${res.locals.render.articles.length})`
      } else {
        res.locals.render.articles = app.locals.cache(`articles-all`, function () {
          return app.locals.models[currentControllerName].all()
        })
        res.locals.render.title = `All Articles (${res.locals.render.articles.length})`
      }
      res.locals.render.keywords = "articles, blog"
      res.locals.render.description = "Articles"
      return next()
    },
    show: function (req, res, next) {
      if (req.params.id) {
        res.locals.render.article = app.locals.cache(`article-${req.params.id}`, function () {
          return app.locals.models[currentControllerName].find(req.params.id)
        })
      } else {
        console.debug(`No article ID provided - getting latest article`)
        res.locals.render.article = app.locals.cache(`article-latest`, (req) => {
          return app.locals.models[currentControllerName].last()
        })
      }
      if (res.locals.render.article) {
        res.locals.render.title = res.locals.render.article.metadata.title
        if (res.locals.render.article.metadata.keywords) {
          res.locals.render.keywords = res.locals.render.article.metadata.keywords
        } else {
          res.locals.render.keywords = res.locals.render.article.metadata.tags.join(', ')
        }
        res.locals.render.description = res.locals.render.article.metadata.blurb
        res.locals.render.articles = app.locals.cache(`articles-all`, function () {
          return app.locals.models[currentControllerName].all()
        })
      }
      return next()
    }
  }
}