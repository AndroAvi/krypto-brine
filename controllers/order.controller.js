const { Order, validateCreateOrder } = require("../models/order.model")
const { User } = require("../models/user.model")
const { Wallet } = require("../models/wallet.model")
const enums = require("../constants/enum")
const addOne = async (req, res) => {
  const { error } = validateCreateOrder(req.body)
  if (error)
    return res
      .status(400)
      .send({ status: "failed", error: error.details[0].message })
  try {
    const { side, currency_buy, currency_sell, volume } = req.body
    const buyWallet = await Wallet.findOne({
      user: req.user._id,
      currency: currency_buy,
    }).lean()
    const sellWallet = await Wallet.findOne({
      user: req.user._id,
      currency: currency_sell,
    }).lean()

    if (side === enums.order.side.BUY) {
      if (buyWallet.balance < volume)
        return res.status(400).send({
          status: "failed",
          error: "not enough balance in sell wallet",
        })
    } else {
      if (sellWallet.balance < volume)
        return res.status(400).send({
          status: "failed",
          error: "not enough balance in sell wallet",
        })
    }
    const order = new Order({
      ...req.body,
      user: req.user._id,
    })
    await order.save()
    return res.status(200).send({
      status: "success",
      message: "successfully created",
      payload: order,
    })
  } catch (e) {
    return res.status(500).send({ status: "failed", error: e.message })
  }
}

module.exports = {
  addOne,
}
