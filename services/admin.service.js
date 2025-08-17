const User = require('../models/user.model')
const validations = require('../utils/validations')
const ApiError = require('../utils/ApiErrors')

exports.findAllUsers = async() => {
  return await User.find()
                  .select('-_id firstname lastname email username role createdAt')
                  .sort({ createdAt : -1})
}

exports.findByUsername = async(username) => {
  return await User.findOne({username: username}).select('-_id firstname lastname email username createdAt')
}

exports.findByEmail = async(email) => {
  // Έλεγχος για email validation
  if (!validations.emailFormat(email)) {
    throw new ApiError(400, "Email format is not correct.");
  }

  return await User.findOne({email: email}).select('-_id firstname lastname email username createdAt')
}

exports.findByUsernameAndDelete = async(username) => {
  return await User.findOneAndDelete({username: username})
}

exports.findByEmailAndDelete = async(email) => {
  return await User.findOneAndDelete({email: email})
}