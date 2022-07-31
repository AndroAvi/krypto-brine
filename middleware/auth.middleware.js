const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
  try {
    let token = req.header("Authorization")
    if (!token) throw new Error("Auth token not provided")
    token = token.replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    req.user = decoded
    next()
  } catch (e) {
    res.status(401).send({
      status: "Access denied",
      message: "Invalid token",
    })
  }
}
