const port = process.env.PORT || 5000
const app = require('./app')
const mongoose = require('mongoose')

//const smartLogger = require('./loggers/smartLogger');

const logger = require('./loggers/logger')

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    logger.info("Connected to MongoDB")
    app.listen(port,() => {
      logger.info(`Server is running on port ${port}`)
    })
  } catch(error) {
    logger.error("MongoDB connection failed:", error)
  }
}

connectDB()


