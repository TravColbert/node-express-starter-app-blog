'use strict'

const marked = require('marked')

/**
 * Return true if article.contentType is 'markdown', 'md', 'text/markdown', 
 * 'text/x-markdown' or empty
 */
const isMarkdown = function (article) {
  if (!article.contentType) {
    return true
  }
  return ['markdown', 'md', 'text/markdown', 'text/x-markdown'].includes(article.contentType)
}

module.exports = {
  // Parse the markdown embedded in the content of the article
  parseArticle: function (req, res, next) {
    if (!res.locals.article?.content) {
      return next()
    }

    if (isMarkdown(res.locals.article)) {
      res.locals.article.content = marked.parse(res.locals.article.content)
    }

    return next()
  },
  renderArticle: function (req, res) {
    if (!res.locals.article) {
      return res.status(404).render('errors/404')
    }
    res.render('articles/show', { article: res.locals.article })
  },
  renderArticles: function (req, res) {
    if (!res.locals.articles) {
      return res.status(404).render('errors/404')
    }
    res.render('articles/index', { articles: res.locals.articles })
  }
}