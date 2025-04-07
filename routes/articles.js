const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

module.exports = function (app) {
    const currentRouteName = path.basename(__filename, '.js')

    const controller = require(path.join(__dirname, '../../', app.locals.appPath, app.locals.controllerPath, currentRouteName))(app)

    router.route("/:id")
        .get((req, res) => {
            return controller.show(req, res)
        })

    router.route("/")
        .get((req, res) => {
            controller.index(req, res)
        })

    return router
}