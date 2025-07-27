const mongoose = require('mongoose')
const Schema = mongoose.Schema

let contactSchema = new Schema({

  firstname: {
    type: String,
    required: [true, "Firstname is required field"],
    trim: true
  },

  lastname: {
    type: String,
    required: [true, "Lastname is required field"],
    trim: true
  },

   email: {
    type: String,
    required: [true, "Email is required field"],
    max: 50,
    trim: true,
    lowercase: true
  },

  message: {
    type: String,
    required: [true, "Message is required field"],
    trim: true
  }
}, {
  collection: 'contact',
  timestamps: true
})

const Contact = mongoose.model("Contact", contactSchema)

module.exports = Contact 