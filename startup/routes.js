const express = require("express")
const user = require("../routes/user.route")
const wallet = require("../routes/wallet.route")
const order = require("../routes/order.route")

const cors = require("cors")

module.exports = function (app) {
  app.use(express.json())
  app.use(express.static("public"))
  app.use(cors())
  app.use("/user", user)
  app.use("/wallet", wallet)
  app.use("/order", order)
}
