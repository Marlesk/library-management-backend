const contactService = require('../services/contact.service')
const logger = require('../loggers/logger')

exports.submitMessage = async(req, res) => {
  logger.info('Sending a contact message')

  let data = req.body

  try {
    const result = await contactService.sendMessage(data)
    logger.info('Message sent successfully')
    res.status(201).json({ status: true, data: result })
  } catch(error) {
     logger.error('Failed to send message')
     const status = error.status || 500
     res.status(status).json({ status: false, message: error.message || 'Internal Server Error'})
  }
}


exports.viewMessage = async(req, res) => {
  logger.info('Retrieving all contact messages')

   try {
    const result = await contactService.getMessage()
    logger.info('Retrieved all messages successfully')
    res.status(200).json({ status: true, data: result })
  } catch (error) {
    logger.error('Failed to retrieve messages')
    res.status(500).json({ status: false, message: 'Failed to fetch contact messages' })
  }

}