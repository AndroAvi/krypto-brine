const bcrypt = require("bcryptjs")
const _ = require("lodash")
const {
  User,
  validateUser,
  pickUserData,
  validateLogin,
} = require("../models/user.model")

//returns logged in user's account details
const readSelf = async (req, res) => {
  const user = await User.findById(req.user._id).select(["_id", "email"])
  res.status(200).send(user)
}

//creates a new user.
const addOne = async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user)
    return res
      .status(400)
      .send({ status: "failed", message: "User already registered" })

  user = new User(pickUserData(req.body))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  await user.save()
  const token = user.generateAuthToken()
  res.status(200).send({
    status: "success",
    message: "User successfully signed up",
    payload: {
      "access-token": token,
    },
  })
}

const login = async (req, res) => {
  const { error } = validateLogin(req.body)
  if (error) return res.status(400).send(error.details[0].message)

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
}

module.exports = {
  readSelf,
  addOne,
  login,
}
