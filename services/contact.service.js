const Contact = require('../models/contact.model')
const ApiError = require('../utils/ApiErrors')
const validations = require('../utils/validations')

exports.sendMessage = async(data) => {
  // Έλεγχος για required πεδία
    for (let key in data) {
      if (!data[key]) {
        throw new ApiError(400, `${key} is required field`)
      }
    }
  
    // Έλεγχος για email validation
    if (!validations.emailFormat(data.email)) {
      throw new ApiError(400, "Email format is not correct.");
    }

    const newContact = new Contact({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      message: data.message
    })

  return await newContact.save()
}

exports.getMessage = async() => {
  return Contact.find().select('-_id firstname lastname email message createdAt').sort({ createdAt : -1})
}