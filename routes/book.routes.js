const express = require('express')
const router = express.Router()
const bookController = require('../controllers/book.controller')
const verifyToken = require('../middlewares/auth.middleware').verifyToken

router.get('/', verifyToken, bookController.getAllBooks)
router.get('/title/:title', verifyToken,  bookController.getBookByTitle)
router.get('/author/:author', verifyToken, bookController.getBooksByAuthor)

module.exports = router 