const borrowService = require('../services/borrow.service')
const logger = require('../loggers/logger')

// For Users
exports.requestBorrowBook = async(req, res) => {
  logger.info('User requests to borrow a book')
  const userId = req.user.userId
  const bookIsbn = req.body.isbn

  try {
    const result = await borrowService.requestBook(userId, bookIsbn)
    logger.info('Borrow request submitted successfully')
    res.status(200).json({ status: true, message: 'Your borrow request has been submitted successfully', borrowCode: result.borrowCode, book: result.book })
  } catch(error) {
    logger.error('Failed to submit borrow request')
    const status = error.status || 500
    res.status(status).json({ status: false, message: error.message || 'Internal Server Error'})
  }
}

exports.viewBorrowBooks = async(req, res) => {
  logger.info('User requests to view borrow records')
  const userId = req.user.userId
  const status = req.query.status

  try {
    const result = await borrowService.getBorrowBooks(userId, status)
    logger.info('Fetched borrow record succesfully')
    res.status(200).json({ status: true, message: 'Borrow records fetched successfully', data: result })
  } catch (error) {
    logger.error('Failed to fetch borrow records')
    const status = error.status || 500
    res.status(status).json({ status: false, message: error.message || 'Internal Server Error'})
  }
}

// For Admin
exports.viewAllRecordsBooks = async(req, res) => {
  logger.info('Admin requests to view borrow records (status: requested, borrowed, returned)')
  const status = req.query.status

  try {
    const result = await borrowService.getAllRecordsBooks(status)

    logger.info('Borrow records fetched successfully')
    res.status(200).json({ status: true,  message: result.length > 0 
        ? 'Borrow records fetched successfully' 
        : `No ${status || ''} records found`, data: result })
  } catch (error) {
    logger.error('Failed to fetch borrow records')
    res.status(500).json({ status: false, message: 'Internal Server Error', error: error.message })
  }
}

exports.acceptBorrowRequest = async (req, res) => {
  logger.info('Attempting to accept borrow request')
  const code = req.params.code

  try {
    const result = await borrowService.acceptRequest(code)
    logger.info('Borrow request with code accepted successfully')
    res.status(200).json({ status: true, message: 'Borrow request accepted successfully', data: result })
  } catch (error) {
    logger.error('Error accepting borrow request')
    const status = error.status || 500
    res.status(status).json({ status: false, message: error.message || 'Internal Server Error'})
  }
}

exports.returnBorrowedBook = async (req, res) => {
  logger.info('Attempting to return borrowed book')
  const isbn = req.params.isbn

  try {
    const result = await borrowService.returnBook(isbn)
    logger.info('Book return completed successfully')
    res.status(200).json({ status: true, message: 'Book successfully marked as returned', data: result })
  } catch (error) {
    logger.error('Failed to process book return')
    const status = error.status || 500
    res.status(status).json({ status: false, message: error.message || 'Internal Server Error'})
  }
}


