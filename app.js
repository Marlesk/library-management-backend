const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors({
  origin: process.env.REDIRECT_URI,
  credentials: true
}))

const user = require('./routes/user.routes')
app.use('/api/users', user)

const auth = require('./routes/auth.routes')
app.use('/api/auth', auth)

const admin = require('./routes/admin.routes')
app.use('/api/admin', admin)

const book = require('./routes/book.routes')
app.use('/api/books', book)

const borrow = require('./routes/borrow.routes')
app.use('/api/borrows', borrow)

const contact = require('./routes/contact.routes')
app.use('/api/contact', contact)

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger')
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, 
  {
  swaggerOptions: {
    persistAuthorization: true
  }
}))

module.exports = app