const express = require('express')
const router = express.Router()

const verifyRole = require('../middlewares/auth.middleware').verifyRole
const verifyToken = require('../middlewares/auth.middleware').verifyToken
const adminController = require('../controllers/admin.controller')
const bookController = require('../controllers/book.controller')
const borrowController = require('../controllers/borrow.controller')
const contactController = require('../controllers/contact.controller')

// Manage Users
router.get('/users', verifyToken, verifyRole('admin'), adminController.getAllUsers)
router.get('/users/username/:username', verifyToken, verifyRole('admin'), adminController.searchByUsername)
router.get('/users/email/:email', verifyToken, verifyRole('admin'), adminController.searchByEmail)

router.delete('/users/username/:username', verifyToken, verifyRole('admin'), adminController.deleteByUsername)
router.delete('/users/email/:email', verifyToken, verifyRole('admin'), adminController.deleteByEmail)

// Manage Books
router.get('/books/google-search/:title/:author', verifyToken, verifyRole('admin'), bookController.searchBook)

router.post('/books', verifyToken, verifyRole('admin'), bookController.addBook)

router.patch('/books/:isbn', verifyToken, verifyRole('admin'), bookController.updateBookByIsbn)

router.delete('/books/:isbn', verifyToken, verifyRole('admin'), bookController.deleteByIsbn)

// Manage Borrows

router.get('/borrows', verifyToken, verifyRole('admin'), borrowController.viewAllRecordsBooks)

router.post('/borrows/accept/:code', verifyToken, verifyRole('admin'), borrowController.acceptBorrowRequest)
router.post('/borrows/returns/:isbn', verifyToken, verifyRole('admin'), borrowController.returnBorrowedBook)  

// View messages

router.get('/messages', verifyToken, verifyRole('admin'), contactController.viewMessage)

module.exports = router
