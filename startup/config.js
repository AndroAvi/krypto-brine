if (process.env.NODE_ENV) {
  require("dotenv").config({
    path: `${__dirname}/../.env.${process.env.NODE_ENV}`,
  })
} else {
  require("dotenv").config()
}

if (process.env.NODE_ENV) console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

const enVars = ["JWT_PRIVATE_KEY", "BASE_URL", "MONGODB_CONNECTION_STRING"]

module.exports.checkEnvVars = function () {
  enVars.forEach((val) => {
    if (!process.env[val]) {
      throw new Error(`FATAL ERROR! ${val} not defined`)
    }
  })
}
