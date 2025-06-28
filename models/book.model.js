const mongoose = require('mongoose')
const Schema = mongoose.Schema

let bookSchema = new Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  author: {
    type: [String],
    required: true
  },

  publisher: {
    type: String,
    trim: true
  },

  year: {
    type: Number,
    default: ''
  },

  isbn: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: '',
  },

  genre: {
    type: [String],
    default: [],
  },

  page: {
    type: Number
  },

  coverImage: {
    type: String, 
    default: '',
  },

  available: {
    type: Boolean,
    default: true,
  }

}, {
  collection: 'books',
  timestamps: true
})

const Book = mongoose.model("Book", bookSchema)

module.exports = Book

