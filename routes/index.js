const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app) {
  const viewHelper = require(path.join(__dirname, '../../', app.locals.appPath, app.locals.helperPath, 'view_helper'))

  // We specifuc a custom controller since we don't use the standard '[routename].js' controller
  const controller = require(path.join(__dirname, '../../', app.locals.appPath, app.locals.controllerPath, 'articles'))(app)

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
      viewHelper.renderLatest
    ])

  return router
}