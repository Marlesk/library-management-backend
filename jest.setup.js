const mongoose = require('mongoose')
require('dotenv').config()
const logger = require('./loggers/logger')

beforeAll(async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connection to MongoDB for Jest (before all tests)')
  } catch (error) {
    console.log("Failed to connect to MongoDB for Jest", error)
    throw error
  }
})

afterAll(async() => {
  await mongoose.connection.close()
  console.log('Disconnected from MongoDB (after all tests)')
})