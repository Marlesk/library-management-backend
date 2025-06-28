const authService = require('../services/auth.service')
const User = require('../models/user.model') 

const getAdminToken = async () => {
  let user = await User.findOne({ username: 'admin' })

  if (!user) {
    user = await User.create({
      firtname: 'Maria',
      lastname: 'Markaki',
      username: 'admin',
      email: 'admin@aueb.gr',
      password: 'Test123!', 
      role: 'admin'
    })
  }

  const token = await authService.generateAccessToken(user)
  return token
}

module.exports = getAdminToken

