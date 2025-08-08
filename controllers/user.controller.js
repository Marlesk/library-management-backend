const userService = require('../services/user.service')
const logger = require('../loggers/logger')

exports.register = async(req, res) => {
  logger.info('Incoming register request')

  let data = req.body

  try {
    const result = await userService.createUser(data)
    logger.info('User registered successfully.')
    res.status(201).json({ status: true, data: result })
  } catch(error) {
     logger.error('Registration failed')
     const status = error.status || 500
     res.status(status).json({ status: false, errors: error.errors || error.message || 'Internal Server Error'})
  }
}

exports.getProfile = async(req, res) => {
  logger.info('View profile')

  try {
    const result = await userService.getUserProfile(req.user.userId)
    logger.info('View profile successfully')
    res.status(200).json({ status: true, data: result })
  } catch(error) {
    logger.error('Failed to view profile.')
    res.status(500).json({ status: false, message: 'Internal Server Error',  })
  }
}

exports.updateProfile = async(req, res) => {
  logger.info('Update profile')

  try {
    const result = await userService.updateUserProfile(req.user.userId, req.body)
    logger.info('Update profile successfully')
    res.status(200).json({ status: true, data: result })
  } catch (error) {
    logger.error('Failed to update profile')
    const status = error.status || 500
    res.status(status).json({ status: false, errors: error.errors || error.message || 'Internal Server Error'})
  }
}

exports.deleteAccount = async(req, res) => {
  logger.info('Delete your account')

  try {
    await userService.deleteUserProfile(req.user.userId)
    logger.info('Delete your account successfully')
    res.status(200).json({ status: true,  message: 'Your account deleted successfully'})
  } catch(error) {
    logger.error('Failed to delete your account')
    res.status(500).json({ status: false, message: 'Internal Server Error' })
  }
}
