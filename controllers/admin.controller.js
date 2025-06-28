const adminService = require('../services/admin.service')
const logger = require('../loggers/logger')

exports.getAllUsers = async(req, res) => {
  logger.info('View all users')

  try {
    const result = await adminService.findAllUsers()
    logger.info('View all users successfully')
    res.status(200).json({ status: true, data: result })
  } catch (error) {
    logger.error('Failed to view all users')
    res.status(500).json({ status: false, message: 'Failed to fetch all users' })
  }
} 

exports.searchByUsername = async(req, res) => {
  logger.info('Find a user by username')
  let username = req.params.username

  try {
    const result = await adminService.findByUsername(username)

    if (result) {
      logger.info('Find a user by username successfully')
      res.status(200).json({ status: true, data: result })
    } else {
      logger.error('User not exist')
      res.status(404).json({ status: false, message: 'User not exist' })
    }
  } catch(error) {
    logger.error('Problem in finding user', error)
    res.status(500).json({ status: false, message: 'Failed to find the user' })
  }
}

exports.searchByEmail = async(req, res) => {
  logger.info('Find a user by email')
  let email = req.params.email

  try {
    const result = await adminService.findByEmail(email)

    if (result) {
      logger.info('Find a user by email successfully')
      res.status(200).json({ status: true, data: result })
    } else {
      logger.error('User not exist')
      res.status(404).json({ status: false, message: 'Email not exist' })
    }
  } catch(error) {
    logger.error('Problem in finding user', error)
    const status = error.status || 500
    res.status(status).json({ status: false, message: error.message || 'Internal Server Error'})
  }
}

exports.deleteByUsername = async(req, res) => {
  logger.info('Delete a user by username')
  let username = req.params.username

  try {
    const result = await adminService.findByUsernameAndDelete(username)

    if (result) {
      logger.info('User deleted successfully')
      res.status(200).json({ status: true, message: 'User deleted successfully'})
    } else {
      logger.error('User not found')
      res.status(404).json({ status: false,  message: 'User not found'})
    }
  } catch (error) {
    logger.error("Problem in deleting user", error)
    res.status(500).json({ status: false, message: 'Failed to delete the user' })
  }
}

exports.deleteByEmail = async(req, res) => {
  logger.info('Delete a user by email')
  let email = req.params.email

  try {
    const result = await adminService.findByEmailAndDelete(email)

    if (result) {
      logger.info('User deleted successfully')
      res.status(200).json({ status: true, message: 'User deleted successfully'})
    } else {
      logger.error('User not found')
      res.status(404).json({ status: false,  message: 'User not found'})
    }
  } catch (error) {
    logger.error("Problem in deleting user", error)
    res.status(500).json({ status: false, message: 'Failed to delete the user' })
  }
}