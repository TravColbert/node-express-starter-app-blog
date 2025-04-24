const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app) {
    const viewHelper = require(path.join(__dirname, '../../', app.locals.appPath, app.locals.helperPath, 'view_helper'))

    const currentRouteName = path.basename(__filename, '.js')

    const controller = require(path.join(__dirname, '../../', app.locals.appPath, app.locals.controllerPath, currentRouteName))(app)

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