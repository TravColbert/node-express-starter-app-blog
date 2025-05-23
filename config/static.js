const fs = require("fs")
const path = require("path")
const express = require("express")

module.exports = function (app) {
  const staticPath = path.join(__dirname, '../', 'articles', 'public')
  if (fs.existsSync(staticPath)) {
    app.locals.debug && console.debug(`Loading static config for: ${appInstance} at ${staticPath}`)
    app.use(express.static(path.join(staticPath)))
  }
}