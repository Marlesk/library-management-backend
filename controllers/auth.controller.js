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
      return res.status(404).json({ status: false, message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, result.password)

    if (isMatch) {
      const token = await authService.generateAccessToken(result)
      logger.info('Success in logging')
      res.status(200).json({status: true, data: token})
    } else {
      logger.error('Incorrect password')
      res.status(404).json({status: false, message: 'Incorrect password'})
    }
    
  } catch(error) {
    logger.error('Problem in logging', error)
    res.status(500).json({status: false, message: 'Login failed', error: error.message})
  }

}