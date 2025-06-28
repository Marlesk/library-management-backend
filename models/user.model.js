const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({

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

  username: {
    type: String,
    //required: [true, "Username is required field"],
    max: 20,
    unique: true,
    trim: true,
    lowercase: true
  },

   email: {
    type: String,
    required: [true, "Email is required field"],
    max: 50,
    trim: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    //required: [true, "Password is required field"],
    max: 20
  },

  role: {
    type: String, 
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  collection: 'users',
  timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User