const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app) {
  const viewHelper = require(path.join(__dirname, '../../', app.locals.appPath, app.locals.helperPath, 'view_helper'))(app)

  // We specify a custom controller since we don't use the standard '[routename].js' controller
  const controller = require(path.join(__dirname, '../../', app.locals.appPath, app.locals.controllerPath, 'articles'))(app)

  router.route("/about")
    .get((req, res, next) => {
      res.locals.pageToRender = "about"
      res.locals.render.title = "About"
      res.locals.render.keywords = "about, blog"
      res.locals.render.description = "About this blog"
      next()
    }, [
      viewHelper.compileMainNavigation,
      viewHelper.renderPage
    ])

  router.route("/")
    .get([
      controller.show,
      viewHelper.parseArticle,
      viewHelper.compileMainNavigation,
      viewHelper.compileSubNavigation,
      viewHelper.compileTagList,
      viewHelper.filter,
      viewHelper.sort,
      viewHelper.paginate,
      viewHelper.setDescription,
      viewHelper.setKeywords,
      viewHelper.renderLatest
    ])

  return router
}