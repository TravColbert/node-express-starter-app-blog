const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app, appInstance) {
    const viewHelper = require(path.join(__dirname, '..', app.locals.basePath, appInstance, app.locals.helperPath, 'view_helper'))(app)

    const currentRouteName = path.basename(__filename, '.js')

    const controller = require(path.join(__dirname, '..', app.locals.basePath, appInstance, app.locals.controllerPath, currentRouteName))(app)

    router.route("/:id")
        .get([
            controller.show,
            viewHelper.parseArticle,
            viewHelper.filter,
            viewHelper.sort,
            viewHelper.compileMainNavigation,
            viewHelper.compileSubNavigation,
            viewHelper.compileTagList,
            viewHelper.renderArticle
        ])

    router.route("/")
        .get([
            controller.index,
            viewHelper.filter,
            viewHelper.sort,
            viewHelper.paginate,
            viewHelper.compileTagList,
            viewHelper.renderArticles
        ])

    return router
}