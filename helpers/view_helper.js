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
  compileMainNavigation: function (req, res, next) {
    if (!res.locals?.render?.articles || !res.locals?.render?.articles?.length) {
      return next()
    }
    res.locals.render.mainNavigation = res.locals.render.articles.map(article => {
      return {
        id: article.id,
        title: article.title,
        url: `/articles/${article.id}`,
        selected: (res.locals.render.article?.metadata?.id === article.id)
      }
    })
    return next()
  },
  compileSubNavigation: function (req, res, next) {
    if (!res.locals.render?.article) {
      return next()
    }
    res.locals.render.subNavigation = []
    return next()
  },
  compileTagList: function (req, res, next) {
    if (!res.locals.render?.articles || !res.locals.render.articles?.length) {
      return next()
    }
    try {
      let tags = []
      for (let article of res.locals.render.articles) {
        tags = [...tags, ...article.tags]
      }
      tags = tags.sort((a, b) => {
        return (a < b)
          ? -1
          : (a > b)
            ? 1
            : 0
      })
      res.locals.render.tags = [...new Set(tags)]
      return next()
    } catch (error) {
      console.error(error)
      next()
    }
  },
  filter: function (req, res, next) {
    const tag = req.query.tag

    if (tag) {
      res.locals.render.articles = res.locals.render.articles.filter(article => {
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

    res.locals.render.articles = res.locals.render.articles.slice(offset, offset + perPage)

    return next()
  },
  // Parse the markdown embedded in the content of the article
  parseArticle: function (req, res, next) {
    if (!res.locals.render?.article?.content) {
      return next()
    }

    if (isMarkdown(res.locals.render.article)) {
      res.locals.render.article.content = marked.parse(res.locals.render.article.content)
    }

    return next()
  },
  renderArticle: function (req, res) {
    if (!res.locals.render.article) {
      return res.status(404).render('errors/404')
    }
    return res.render('articles/show', res.locals.render)
  },
  renderArticles: function (req, res) {
    if (!res.locals.render.articles) {
      return res.status(404).render('errors/404')
    }

    return res.render('articles/index', res.locals.render)
  },
  renderPage: function (req, res) {
    if (!res.locals.pageToRender) {
      return res.status(404).render('errors/404')
    }

    return res.render(res.locals.pageToRender, res.locals.render)
  },
  renderLatest: function (req, res) {
    if (!res.locals.render?.articles || !res.locals.render?.article) {
      return res.status(404).render('errors/404')
    }

    res.locals.render.title = 'Latest Articles'

    return res.render('articles/latest', res.locals.render)
  },
  sort: function (req, res, next) {
    const sortBy = req.query.sort_by || 'publishedAt'
    const sortOrder = req.query.sort_order || 'desc'

    if (sortBy === 'publishedAt') {
      res.locals.render.articles.sort((a, b) => {
        const aPublishedAt = new Date(a.publishedAt)
        const bPublishedAt = new Date(b.publishedAt)
        return (sortOrder === 'desc')
          ? (aPublishedAt < bPublishedAt)
            ? 1
            : (aPublishedAt > bPublishedAt)
              ? -1
              : 0
          : -1
      })
    } else if (sortBy === 'title') {
      res.locals.render.articles.sort((a, b) => {
        return sortOrder === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
      })
    }

    return next()
  }
}