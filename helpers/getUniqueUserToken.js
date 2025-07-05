const authService = require('../services/auth.service')
const User = require('../models/user.model')

const getUniqueUserToken = async () => {
  const timestamp = Date.now()
  const username = `testuser_${timestamp}`
  const email = `${username}@test.com`

  const user = await User.create({
    firstname: 'Test',
    lastname: 'User',
    username,
    email,
    password: 'Test123!',
    role: 'user'
  })

  const token = await authService.generateAccessToken(user)
  return token
}

module.exports = getUniqueUserToken