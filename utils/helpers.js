const jwt = require('jsonwebtoken')

module.exports = {
  errorMsg,
  generateToken
}

function errorMsg(error, msg, rtn = null) {
  console.error(msg, { message: error.message, error })
  return rtn
}

function generateToken(user) {
  if (user.password) {
    delete user.password
  }
  const payload = { ...user }

  const secret = process.env.TOKEN_SECRET

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, secret, options)
}
