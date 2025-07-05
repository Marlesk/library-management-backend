const express = require('express')
const router = express.Router()

const borrowController = require('../controllers/borrow.controller')
const verifyToken = require('../middlewares/auth.middleware').verifyToken


// for Users
router.get('/', verifyToken, borrowController.viewBorrowBooks)

router.post('/', verifyToken, borrowController.requestBorrowBook)

module.exports = router
