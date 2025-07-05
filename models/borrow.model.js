const mongoose = require('mongoose')
const Schema = mongoose.Schema

let borrowSchema = new Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },

  bookId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Book'
  },

  borrowCode: {
    type: String,
    unique: true
  },

  status: {
    type: String,
    enum: ['requested', 'borrowed', 'returned'],
    default: 'requested'
  },

  borrowDate: {
    type: Date,
    default: null
  },

  returnDate: {
    type: Date,
    default: null
  }

}, {
  collection: 'borrows',
  timestamps: true
})

const Borrow = mongoose.model("Borrow", borrowSchema)

module.exports = Borrow

