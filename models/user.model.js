const jwt = require("jsonwebtoken")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity").default
const mongoose = require("mongoose")
const _ = require("lodash")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 255,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_PRIVATE_KEY
  )
}

const User = mongoose.model("User", userSchema)

function validateUser(data) {
  const complexityOptions = {
    min: 4,
    max: 1024,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 3,
  }

  const schema = Joi.object({
    email: Joi.string().min(7).max(255).email(),
    password: passwordComplexity(complexityOptions),
  })

  return schema.validate(data)
}

function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.required(),
    password: Joi.string().min(4).max(1024).required(),
  })

  if (schema.validate(req).error) return schema.validate(req)
  return validateUser(_.omit(req, ["password"]))
}

function pickUserData(userData) {
  return _.pick(userData, ["email", "password"])
}

exports.User = User
exports.validateUser = validateUser
exports.validateLogin = validateLogin
exports.pickUserData = pickUserData
