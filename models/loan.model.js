const mongoose = require('mongoose')
const Schema = mongoose.Schema

let loanSchema = new Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },

  bookId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Book'
  },

  borrowDate: {
    type: Date,
    default: Date.now
  },

  returnDate: {
    type: Date,
    default: null
  }

}, {
  collection: 'loans'
})

const Loan = mongoose.model("Loan", loanSchema)

module.exports = Loan

