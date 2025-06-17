const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const apiError = require('../utils/ApiErrors')
const emailFormat = require('../utils/validations')

exports.createUser = async(data) => {
  
  // Έλεγχος για required πεδία
  for (let key in data) {
    if (!data[key]) {
      throw new apiError(400, `${key} is required field`)
    }
  }

  // Έλεγχος για email validation
  if (!emailFormat(data.email)) {
    throw new apiError(400, "Email format is not correct.");
  }

  // Έλεγχος αν υπάρχει ήδη το username ή το email
  const existingUserByUsername = await User.findOne({ username: data.username })
  if (existingUserByUsername) {
    throw new apiError(409, 'Username already exists')
  }

  const existingUserByEmail = await User.findOne({ email: data.email })
  if (existingUserByEmail) {
    throw new apiError(409, 'Email already exists')
  }

   // Έλεγχος αν πάει να δημιουργηθεί δεύτερος admin
  if (data.role === 'admin') {
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      throw new apiError(409, 'An admin user already exists. Cannot create a second one')
    }
  }

  let hashedPassword = ""
  const saltRounds = 10

  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, saltRounds)
  }

  const newUser = new User({
    firstname: data.firstname,
    lastname: data.lastname,
    username: data.username,
    password: hashedPassword,
    email: data.email,
    role: data.role
  })

  return await newUser.save()
}

exports.findUserByUsername = async(username) => {
  return await User.findOne({username: username})
}

exports.getUserProfile = async(userId) => {
  const user = await User.findById(userId).select('-_id firstname lastname username email role')
  return user
}

exports.updateUserProfile = async(userId, data) => {
  const allowedFields = ['email', 'password'];
  const updates = {}

  // Έλεγχος για required πεδία
  for (let key in data) {
    if (!allowedFields.includes(key)) {
      throw new apiError(400, `${key} cannot be updated`);
    }
    
    if (!data[key]) {
      throw new apiError(400, `${key} is required field`)
    }
  }

  if (data.email) {
    if (!emailFormat(data.email)) {
      throw new apiError(400, "Email format is not correct.");
    }
  }

  const existingUserByEmail = await User.findOne({ email: data.email })
  if (existingUserByEmail) {
    throw new apiError(409, 'Email already exists')
  }

  if(data.email) updates.email = data.email

  if(data.password) {
    const saltRounds = 10
    updates.password = await bcrypt.hash(data.password, saltRounds
    )
  }

  const updateUser = await User.findByIdAndUpdate(userId, 
                                        { $set: updates }, 
                                        { new: true, runValidators: true }
                                      ).select('-_id firstname lastname username email role')
  
  return updateUser
}

exports.deleteUserProfile = async(userId) => {
  return await User.findOneAndDelete({_id: userId})
}

/* istanbul ignore next */
exports.findLastInsertedUser = async() => {
  // console.log("Find last inserted user")
  try {
    const result = await User.find().sort({_id: -1}).limit(1)
    //console.log("Success in finding last inserted user") 
    return result[0]
  } catch(error) {
    //console.log("Problem in finding last inserted user", error)
    return false
  }
}









