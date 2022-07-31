//Create and initialize app.
const express = require("express")
const app = express()
const logger = require("morgan")

//Setup logging and environment variables
const config = require("./startup/config")
config.checkEnvVars()
require("./startup/db")()

//Include the startup routes.
require("./startup/routes")(app)
require("./startup/validation")()

app.use(logger("dev"))

//Get port variable from the env, default is 5000.
const port = process.env.PORT || 5000
module.exports = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
)
