const deposit = async (req, res) => {
  try {
    return res.status(200).send("success.")
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

const withdraw = async (req, res) => {
  try {
    return res.status(200).send("success.")
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

const readBalance = async (req, res) => {
  try {
    return res.status(200).send("success.")
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
}

module.exports = {
  deposit,
  withdraw,
  readBalance,
}
