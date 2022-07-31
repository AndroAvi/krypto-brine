const express = require("express")
const users = require("../routes/user.route")
const cors = require("cors")

module.exports = function (app) {
  app.use(express.json())
  app.use(express.static("public"))
  app.use(cors())
  app.use("/user", users)
}
