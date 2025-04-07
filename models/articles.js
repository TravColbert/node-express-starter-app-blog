'use strict'

const fs = require('fs')
const path = require('path')

const articlePath = path.join(__dirname, '../', 'articles')

const getArticleMetadata = function (fileName) {
    try {
        console.debug(`Fetching metadata from article: ${fileName}`)
        const article = require(path.join(articlePath, fileName))
        article.metadata['fileName'] = path.basename(fileName, '.js')
        article.metadata['id'] = path.basename(fileName, '.js')

        return article.metadata
    } catch (error) {
        console.error(`Failed to retrieve metadata for article: ${fileName}`)
    }
}

module.exports = {
    all: function () {
        console.debug(`Scanning article location: ${articlePath}`)
        return fs.readdirSync(articlePath)
            .filter(file => file.endsWith('.js'))
            .map(getArticleMetadata)
    },
    find: function (articleName) {
        const articleFileName = path.join(articlePath, articleName + '.js')
        try {
            console.debug(`Fetching article: ${articleFileName}`)
            const article = require(articleFileName)
            return article
        } catch (error) {
            console.error(`Could not read article: ${articleFileName}`)
        }
    }
}