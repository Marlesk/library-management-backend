const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

// Δημιουργία έγκυρου JWT token με ληγμένη ημερομηνία
const getExpiredUserToken = async () => {
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
  
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  }
 
  const expiredToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: -3600
  })

  return expiredToken
}

module.exports = getExpiredUserToken