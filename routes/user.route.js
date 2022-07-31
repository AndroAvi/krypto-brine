const auth = require("../middleware/auth.middleware") //here auth is authorization not authentication
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const controller = require("../controllers/user.controller")

router.get("/", auth({}), controller.readSelf)

router.post("/signup", controller.addOne)

router.post("/login", controller.login)

router.get("/dashboard", auth({ admin: true }), controller.readAdmin)

module.exports = router
