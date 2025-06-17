const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors({
  origin: ['http://localhost:3000']
}))

const user = require('./routes/user.routes')
app.use('/api/users', user)

const auth = require('./routes/auth.routes')
app.use('/api/auth', auth)

const admin = require('./routes/admin.routes')
app.use('/api/admin', admin)

const book = require('./routes/book.routes')
app.use('/api/books', book)

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger')
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))



module.exports = app