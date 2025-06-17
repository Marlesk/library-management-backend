const User = require('../models/user.model')

exports.findAllUsers = async() => {
  return await User.find().select('-password')
}

exports.findByUsername = async(username) => {
  return await User.findOne({username: username}).select('-password')
}

exports.findByEmail = async(email) => {
  return await User.findOne({email: email}).select('-password')
}

exports.findByUsernameAndDelete = async(username) => {
  return await User.findOneAndDelete({username: username})
}

exports.findByEmailAndDelete = async(email) => {
  return await User.findOneAndDelete({email: email})
}