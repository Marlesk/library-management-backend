const mongoose = require('mongoose')
const Schema = mongoose.Schema

let bookSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  author: {
    type: [String],
    default: ['Unknown']
  },

  description: {
    type: String,
    default: '',
  },

  genre: {
    type: [String],
    default: [],
  },

  year: {
    type: Number,
    default: ''
  },

  isbn: {
    type: String,
    default: '',
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

