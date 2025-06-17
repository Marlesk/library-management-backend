const express = require('express')
const router = express.Router()
const bookController = require('../controllers/book.controller')

router.get('/search/:title', bookController.searchBook)

router.post('/', bookController.addBook)

module.exports = router 