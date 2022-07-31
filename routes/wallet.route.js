const auth = require("../middleware/auth.middleware") //here auth is authorization not authentication
const _ = require("lodash")
const express = require("express")
const router = express.Router()
const controller = require("../controllers/wallet.controller")

router.post("/deposit", auth, controller.deposit)

router.post("/withdrawl", auth, controller.withdraw)

router.get("/balances", auth, controller.readBalance)

module.exports = router
