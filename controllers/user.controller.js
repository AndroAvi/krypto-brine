const bcrypt = require("bcryptjs")
const _ = require("lodash")
const {
  User,
  validateUser,
  pickUserData,
  validateLogin,
} = require("../models/user.model")

const enums = require("../constants/enum")
const { Wallet } = require("../models/wallet.model")

//returns logged in user's account details
const readSelf = async (req, res) => {
  const user = await User.findById(req.user._id).select(["_id", "email"])
  res.status(200).send(user)
}

//creates a new user.
const addOne = async (req, res) => {
  const { error } = validateUser(req.body)
  if (error)
    return res
      .status(400)
      .send({ status: "failed", error: error.details[0].message })

  try {
    let user = await User.findOne({ email: req.body.email })
    if (user)
      return res
        .status(400)
        .send({ status: "failed", message: "User already registered" })

    user = new User(pickUserData(req.body))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    if (req.query.admin === "1") user.isAdmin = true
    await user.save()
    await Promise.all(
      Object.keys(enums.currency).map(async (val) => {
        const wallet = new Wallet({
          user: user._id,
          currency: enums.currency[val],
        })
        await wallet.save()
      })
    )
    const token = user.generateAuthToken()
    res.status(200).send({
      status: "success",
      message: "User successfully signed up",
      payload: {
        "access-token": token,
      },
    })
  } catch (e) {
    return res.status(500).send({ status: "failed", message: e.message })
  }
}

const login = async (req, res) => {
  const { error } = validateLogin(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    let user = await User.findOne({ email: req.body.email })
    if (!user)
      return res
        .status(400)
        .send({ status: "failed", message: "Invalid email or password" })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword)
      return res
        .status(400)
        .send({ status: "failed", message: "Invalid email or password" })

    const token = user.generateAuthToken()
    res.status(200).send({
      status: "success",
      message: "User successfully logged in",
      payload: {
        "access-token": token,
      },
    })
  } catch (e) {
    return res.status(500).send({ status: "failed", message: e.message })
  }
}

const readAdmin = async (req, res) => {
  try {
    return res.status(200).send("success.")
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

module.exports = {
  readSelf,
  addOne,
  login,
  readAdmin,
}
