const jwt = require("jsonwebtoken")
const Joi = require("joi")
const mongoose = require("mongoose")
const _ = require("lodash")
const enums = require("../constants/enum")

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    currency_buy: {
      type: String,
      enum: [...Object.values(enums.currency)],
      required: true,
    },
    currency_sell: {
      type: String,
      enum: [...Object.values(enums.currency)],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not a valid integer value for volume",
      },
    },
    side: {
      type: String,
      enum: [...Object.values(enums.order.side)],
      required: true,
    },
    state: {
      type: String,
      enum: [...Object.values(enums.order.state)],
      required: true,
      default: enums.order.state.PENDING,
    },
  },
  { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)

const validateCreateOrder = (data) => {
  const schema = Joi.object({
    currency_buy: Joi.string()
      .valid(
        enums.currency.BITCOIN,
        enums.currency.ETHEREUM,
        enums.currency.DOGECOIN
      )
      .required()
      .messages({
        "string.invalid": `Only valid values for the gender field are '${enums.currency.BITCOIN}', '${enums.currency.ETHEREUM}', and '${enums.currency.DOGECOIN}'`,
      }),
    currency_sell: Joi.string()
      .valid(
        enums.currency.BITCOIN,
        enums.currency.ETHEREUM,
        enums.currency.DOGECOIN
      )
      .disallow(Joi.ref("currency_buy"))
      .required()
      .messages({
        "string.invalid": `Only valid values for the gender field are '${enums.currency.BITCOIN}', '${enums.currency.ETHEREUM}', and '${enums.currency.DOGECOIN}'`,
      }),
    price: Joi.number().min(1).required(),
    volume: Joi.number().integer().min(1).required(),
    side: Joi.string()
      .valid(enums.order.side.BUY, enums.order.side.SELL)
      .required()
      .messages({
        "string.invalid": `Only valid values for the order field are '${enums.order.side.BUY}' and '${enums.order.side.SELL}'`,
      }),
  })
  return schema.validate(data)
}

module.exports.Order = Order
module.exports.validateCreateOrder = validateCreateOrder
