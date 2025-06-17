const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller')
const verifyToken = require('../middlewares/auth.middleware').verifyToken


router.post('/register', userController.register)

router.get('/profile', verifyToken, userController.getProfile)
router.patch('/profile', verifyToken, userController.updateProfile)

router.delete('/profile', verifyToken, userController.deleteAccount)

module.exports = router