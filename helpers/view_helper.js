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
  filter: function (req, res, next) {
    const tag = req.query.tag

    if (tag) {
      res.locals.articles = res.locals.articles.filter(article => {
        const articleTags = article.tags.map(articleTag => articleTag.toLowerCase())
        return articleTags.includes(tag.toLowerCase())
      })
    }

    return next()
  },
  paginate: function (req, res, next) {
    let page = parseInt(req.query.page) || 1
    if (page < 1) page = 1
    let perPage = parseInt(req.query.per_page) || 10
    if (perPage < 1) perPage = 10
    const offset = (page - 1) * perPage

    res.locals.articles = res.locals.articles.slice(offset, offset + perPage)

    return next()
  },
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
    return res.render('articles/show', { article: res.locals.article })
  },
  renderArticles: function (req, res) {
    if (!res.locals.articles) {
      return res.status(404).render('errors/404')
    }
    return res.render('articles/index', { articles: res.locals.articles })
  },
  sort: function (req, res, next) {
    const sortBy = req.query.sort_by || 'createdAt'
    const sortOrder = req.query.sort_order || 'desc'

    if (sortBy === 'createdAt') {
      res.locals.articles.sort((a, b) => {
        return sortOrder === 'desc' ? Date.parse(b.createdAt) - Date.parse(a.createdAt) : Date.parse(a.createdAt) - Date.parse(b.createdAt)
      })
    } else if (sortBy === 'title') {
      res.locals.articles.sort((a, b) => {
        return sortOrder === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
      })
    }

    return next()
  }
}