const { Wallet, validateTransaction } = require("../models/wallet.model")
const { User } = require("../models/user.model")
const mongoose = require("mongoose")

const deposit = async (req, res) => {
  const { error } = validateTransaction(req.body)
  if (error)
    return res
      .status(400)
      .send({ status: "failed", error: error.details[0].message })
  try {
    const { currency, amount } = req.body
    const wallet = await Wallet.findOneAndUpdate(
      {
        user: req.user._id,
        currency,
      },
      { $inc: { balance: amount } },
      { new: true }
    )
    return res.status(200).send({
      status: "success",
      message: "successfully deposited funds",
      payload: {
        balance: wallet.balance,
        currency: wallet.currency,
      },
    })
  } catch (e) {
    return res.status(500).send({ status: "failed", error: e.message })
  }
}

const withdraw = async (req, res) => {
  const { error } = validateTransaction(req.body)
  if (error)
    return res
      .status(400)
      .send({ status: "failed", error: error.details[0].message })
  try {
    const { currency, amount } = req.body
    const wallet = await Wallet.findOne({
      user: req.user._id,
      currency,
    })
    if (wallet.balance < amount)
      return res
        .status(400)
        .send({ status: "failed", error: "not enough balance in wallet" })
    wallet.balance -= amount
    await wallet.save()
    return res.status(200).send({
      status: "success",
      message: "successfully withdrawn funds",
      payload: {
        balance: wallet.balance,
        currency: wallet.currency,
      },
    })
  } catch (e) {
    return res.status(500).send({ status: "failed", error: e.message })
  }
}

const readBalance = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: {
            $eq: mongoose.Types.ObjectId(req.user._id),
          },
        },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "_id",
          foreignField: "user",
          as: "wallets",
        },
      },
    ]
    let user = await User.aggregate(pipeline)
    user = user[0]
    user.wallets = user.wallets.map((wallet) => {
      return {
        currency: wallet.currency,
        balance: wallet.balance,
      }
    })
    return res.status(200).send({
      status: "success",
      message: "successfully fetched funds",
      payload: user.wallets,
    })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

module.exports = {
  deposit,
  withdraw,
  readBalance,
}
