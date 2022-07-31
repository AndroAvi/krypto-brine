const auth = require("../middleware/auth.middleware") //here auth is authorization not authentication
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const controller = require("../controllers/order.controller")

router.post("/create", auth({}), controller.addOne)

module.exports = router
