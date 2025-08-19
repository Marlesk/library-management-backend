const userService = require('../services/user.service')
const authService = require('../services/auth.service')
const bcrypt = require('bcrypt')
const logger = require('../loggers/logger')

exports.login = async(req, res) => {
  logger.info('Login user', req.body)
  const username = req.body.username?.toLowerCase()
  const password = req.body.password

  if (!username || !password) {
    logger.error('Username or password missing')
    return res.status(400).json({ status: false, message: 'Username and password are required' })
  }

  try {
    const result = await userService.findUserByUsername(username)

    if (!result) {
      logger.error('User not found')
      return res.status(404).json({ status: false, errors: {username: 'User not found'} })
    }

    const isMatch = await bcrypt.compare(password, result.password)

    if (isMatch) {
      const token = await authService.generateAccessToken(result)
      logger.info('Success in logging')
      res.status(200).json({status: true, data: token})
    } else {
      logger.error('Incorrect password')
      res.status(404).json({status: false, errors: {password: 'Incorrect password'} })
    }
    
  } catch(error) {
    logger.error('Problem in logging', error)
    res.status(500).json({status: false, message: 'Login failed', error: error.message})
  }

}

exports.googleLogin = async(req, res) => {
  logger.info('Google Login')
  const { code } = req.body

  if (!code) {
    logger.error('Authorization code is missing')
    return res.status(400).json({ status: false, message: 'Authorization code is missing'})
  } 

  try {
    let user = await authService.googleAuth(code)
    if (user) {
      logger.info('Google Login successful', user)
      res.status(200).json({ status: true, message: 'Login/register successfully', data: user})
    } else {
      logger.error('Problem in Google login')
      res.status(401).json({ status: false, message: 'Problem in Google login'})
    }
  } catch (error) {
    logger.error('Error during Google login:', error)
    const status = error.status || 500
    res.status(status).json({ status: false, errors: error.errors || error.message  || 'Google authentication failed'})
  }
}