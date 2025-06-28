const User = require('../models/user.model')
const validations = require('../utils/validations')
const apiError = require('../utils/ApiErrors')

exports.findAllUsers = async() => {
  return await User.find().select('-password')
}

exports.findByUsername = async(username) => {
  return await User.findOne({username: username}).select('-password')
}

exports.findByEmail = async(email) => {
  // Έλεγχος για email validation
  if (!validations.emailFormat(email)) {
    throw new apiError(400, "Email format is not correct.");
  }

  return await User.findOne({email: email}).select('-password')
}

exports.findByUsernameAndDelete = async(username) => {
  return await User.findOneAndDelete({username: username})
}

exports.findByEmailAndDelete = async(email) => {
  return await User.findOneAndDelete({email: email})
}