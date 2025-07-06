const authService = require('../services/auth.service')
const User = require('../models/user.model') 
const bcrypt = require('bcrypt')

const getAdminToken = async () => {
  let user = await User.findOne({ username: 'admin' })

  if (!user) {
    const hashedPassword = await bcrypt.hash('Test123!', 10)
    user = await User.create({
      firstname: 'Maria',
      lastname: 'Markaki',
      username: 'admin',
      email: 'admin@aueb.gr',
      password: hashedPassword, 
      role: 'admin'
    })
  }

  const token = await authService.generateAccessToken(user)
  return token
}

module.exports = getAdminToken

