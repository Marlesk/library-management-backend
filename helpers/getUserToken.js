const authService = require('../services/auth.service')
const User = require('../models/user.model')

const getUserToken = async () => {
   let user = await User.findOne({ username: 'user1' })
  
    if (!user) {
      user = await User.create({
        firstname: "Jenny",
        lastname: "Themeli",
        username: 'user1',
        email: 'user1@aueb.gr',
        password: '12345', 
        role: 'user'
      })
    }
  
    const token = await authService.generateAccessToken(user)
    return token
}

module.exports = getUserToken
