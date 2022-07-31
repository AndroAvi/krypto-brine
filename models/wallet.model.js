const jwt = require("jsonwebtoken")
const Joi = require("joi")
const mongoose = require("mongoose")
const _ = require("lodash")
const enums = require("../constants/enum")

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  currency: {
    type: String,
    enum: [...Object.values(enums.currency)],
    required: true,
  },
})

walletSchema.index({ user: 1, currency: 1 })

const Wallet = mongoose.model("Wallet", walletSchema)

Wallet.on("index", (error) => {
  if (error) console.log(error)
})

module.exports.Wallet = Wallet
