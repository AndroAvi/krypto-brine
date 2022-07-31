const mongoose = require("mongoose")

module.exports = function () {
  const db = process.env.NODE_ENV ? `-${process.env.NODE_ENV}` : ""
  mongoose
    .connect(`${process.env.MONGODB_CONNECTION_STRING}/KryptoBrine${db}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to Krypto-Brine${db} MongoDB Database.`))
}
