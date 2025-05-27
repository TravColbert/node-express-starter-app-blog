'use strict'

const fs = require('fs')
const path = require('path')

const articlePath = path.join(__dirname, '../', 'articles')

const getArticleId = function (fileName) {
  return path.basename(fileName, '.js')
}

const getArticleMetadata = function (fileName) {
  try {
    const article = require(path.join(articlePath, fileName))
    article.metadata['fileName'] = path.basename(fileName, '.js')
    article.metadata['id'] = path.basename(fileName, '.js')

    return article.metadata
  } catch (error) {
    console.error(`Failed to retrieve metadata for article: ${fileName}`)
    return false
  }
}

const getArticleFull = function (fileName) {
  try {
    const article = require(path.join(articlePath, fileName))
    article.metadata['fileName'] = path.basename(fileName, '.js')
    article.metadata['id'] = path.basename(fileName, '.js')

    return article
  } catch (error) {
    console.error(`Could not read article: ${fileName}`)
    return false
  }
}

const filterHidden = function (metadata) {
  return (!metadata.hidden)
}

const filterPublished = function (metadata) {
  /**
   * if article.metadata.publishedAt is not defined, return false
   * if article.metadata.publishedAt is false, return false
   * if article.metadata.publishedAt is true, return publishedAt
   */
  if (!metadata.publishedAt) return false
  return metadata.publishedAt
}

const sortByPublishedAtDesc = function (a, b) {
  const aPublishedDate = new Date(a.publishedAt)
  const bPublishedDate = new Date(b.publishedAt)
  if (aPublishedDate < bPublishedDate) return 1
  if (aPublishedDate > bPublishedDate) return -1
  return 0
}

module.exports = {
  all: function (filterFunction, retrievalFunction) {
    filterFunction = filterFunction || filterPublished
    retrievalFunction = retrievalFunction || getArticleMetadata

    return fs.readdirSync(articlePath)
      .filter(file => file.endsWith('.js'))
      .map(retrievalFunction)
      .filter(filterHidden)
      .filter(filterFunction)
  },
  find: function (articleName) {
    const articleFileName = path.join(articlePath, articleName + '.js')
    try {
      const article = require(articleFileName)
      article.metadata['fileName'] = path.basename(articleFileName, '.js')
      article.metadata['id'] = path.basename(articleFileName, '.js')
      return article
    } catch (error) {
      console.error(`Could not read article: ${articleFileName}`)
      return false
    }
  },
  /**
   * Get the last-published article
   */
  last: function () {
    const articles = this.all()
    if (articles.length > 0) {
      const targetArticleId = articles.sort(sortByPublishedAtDesc)[0].id
      return this.find(targetArticleId)
    } else {
      return false
    }
  }
}