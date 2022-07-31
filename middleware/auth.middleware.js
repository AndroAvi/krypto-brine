const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
  const token = req.header(process.env.JWT_HEADER)
  if (!token) return res.status(401).send("Access denied. No token provided. ")

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    req.user = decoded
    next()
  } catch (e) {
    res
      .status(401)
      .send({
        status: "Access denied",
        message: "Access denied. Invalid token",
      })
  }
}
