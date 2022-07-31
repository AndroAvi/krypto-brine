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

const validateTransaction = (data) => {
  const schema = Joi.object({
    currency: Joi.string()
      .valid(
        enums.currency.BITCOIN,
        enums.currency.ETHEREUM,
        enums.currency.DOGECOIN
      )
      .required()
      .messages({
        "string.invalid": `Only valid values for the wallet field are '${enums.currency.BITCOIN}', '${enums.currency.ETHEREUM}', and '${enums.currency.DOGECOIN}'`,
      }),
    amount: Joi.number().min(1).required(),
  })
  return schema.validate(data)
}

module.exports.Wallet = Wallet
module.exports.validateTransaction = validateTransaction
