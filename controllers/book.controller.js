const bookService = require('../services/book.service')
const logger = require('../loggers/logger')

// For admin user
exports.searchBook = async(req, res) => {
  logger.info('Search a book using Google Books API')
  let title = req.params.title
  let author = req.params.author

  if ((!title?.trim() || !author?.trim())) {
    logger.error('Missing search query')
    return res.status(400).json({ status: false,  error: 'Missing search query' })
  }
    
  try {
    const result = await bookService.findBook(title, author)

    if (result.length > 0) {
      logger.info('Find the book successfully via Google Books API')
      res.status(200).json({ status: true, data: result })
    } 

  } catch(error) {
    logger.error('Problem in finding book')
    res.status(500).json({ status: false, message: 'Error fetching books from Google Library'})
  }

}

exports.addBook = async(req, res) => {
  logger.info('Add new book')

  let data = req.body

  try {
    const result = await bookService.createBook(data)
    logger.info('Add the book successfully')
    res.status(200).json({ status: true, data: result})
  } catch(error) {
    logger.error('Problem in adding book')
    const status = error.status || 500
    res.status(status).json({ status: false, errors: error.errors || error.message || 'Internal Server Error' })
  }
}

exports.updateBookByIsbn = async(req, res) => {
  logger.info('Update a book')

  const isbn = req.params.isbn
  const updates = req.body

  try {
    const result = await bookService.updateBookDetails(isbn, updates)

    if (!result) {
      return res.status(404).json({ status: false, message: "Book not found" })
    }
    res.status(200).json({ status: true, data: result })
  } catch(error) {
    logger.error('Error updating book')
    const status = error.status || 500
    res.status(status).json({ status: false, message: error.message || 'Error updating book' });
  }
}

exports.deleteByIsbn = async(req, res) => {
  logger.info('Delete a book by isbn')

  const isbn = req.params.isbn

  try {
    const result = await bookService.removeBookByIsbn(isbn)

    if (result) {
      logger.info('Book deleted successfully')
      res.status(200).json( { status: true, message: 'Book deleted successfully'})
    } else {
      logger.error('Book not found')
      res.status(404).json({ status: false,  message: 'Book not found'})
    }
    
  } catch (error) {
    logger.error("Problem in deleting book", error)
    const status = error.status || 500
    res.status(status).json({ status: false, errors: error.errors || error.message || 'Internal Server Error' })
  }
}

// For all users
exports.getAllBooks = async(req, res) => {
  logger.info('View all library books')

  try {
    const result = await bookService.findAllBooks()
    logger.info('View all books in library successsfully')
    res.status(200).json({ status: true, data: result})
  } catch(error) {
    logger.error('Problem in getting all books')
    res.status(500).json({ status: false, message: 'Failed to get all books due to server error', error: error.message})
  }
}

exports.getBooksByTitle = async(req, res) => {
  logger.info('Search a book by title')
  const title = req.params.title

  try {
    const result = await bookService.findBooksByTitle(title)

    if(result.length > 0) {
      logger.info('Details book by title')
      res.status(200).json({ status: true, data: result })
    } else {
      logger.error('Book not exists')
      res.status(404).json({ status: false, message: 'Book not exists'})
    }
  } catch(error) {
    logger.info('Problem in getting book')
    res.status(500).json({ status: false, message: 'Failed to get the book due to server error', error: error.message})
  }
}

exports.getBooksByAuthor = async(req, res) => {
  logger.info('Search books by author ')
  const author = req.params.author

  try {
    const result = await bookService.findBooksByAuthor(author)

    if(result.length > 0) {
      logger.info('Details books by author')
      res.status(200).json({ status: true, data: result })
    } else {
      logger.error('Author not exists')
      res.status(404).json({ status: false, message: 'Author not exists'})
    }
  } catch(error) {
    logger.info('Problem in getting book')
    res.status(500).json({ status: false, message: 'Failed to get the book due to server error', error: error.message})
  }
}

exports.getBookByIsbn = async(req, res) => {
  logger.info('Search book by isbn')
  const isbn = req.params.isbn

  try {
    const result = await bookService.findBookByIsbn(isbn)

    if (!result) {
      logger.error('Book not exists')
      res.status(404).json({ status: false, message: 'Book not exists'})
    }

    logger.info('Details book by isbn')
    res.status(200).json({ status: true, data: result })

  } catch(error) {
    logger.info('Problem in getting book')
    res.status(500).json({ status: false, message: 'Failed to get the book due to server error', error: error.message})
  }
}