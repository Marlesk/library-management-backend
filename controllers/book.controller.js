const bookService = require('../services/book.service')
const logger = require('../loggers/logger')

exports.searchBook = async(req, res) => {
  logger.info('Search a book')
  let title = req.params.title

  if (!title) return res.status(400).json({ error: "Missing search query" });

  try {
    const result = await bookService.findByTitle(title)

    if (result) {
      console.log('Find the book successfully')
      res.status(200).json({ status: true, data: result })
    } else {
      console.log('Book not exist')
      res.status(404).json({ status: false, message: 'Book not exist' })
    }
  } catch(error) {
    console.error('Problem in finding book')
    res.status(500).json({ status: false, message: 'Error fetching books from GoogleLibrary'})
  }

}

exports.addBook = async(req, res) => {
  logger.info('Add new book')

  let data = req.body

  try {
    const result = await bookService.createBook(data)
    console.log('Add the book successfully')
    res.status(200).json({ status: true, data: result})
  } catch(error) {
    console.error('Problem in adding book')
    res.status(500).json({ status: false, message: 'Error adding book', error: error.message})
  }
}