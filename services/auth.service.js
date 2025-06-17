const jwt = require('jsonwebtoken')

exports.generateAccessToken = async(user) => {
  const secret = process.env.TOKEN_SECRET 
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role
  }
  const options = {expiresIn: '1h'}

  return jwt.sign(payload, secret, options)
}

