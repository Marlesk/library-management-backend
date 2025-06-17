const m2s = require('mongoose-to-swagger')
const User = require('../../models/user.model')

module.exports = {
  User: m2s(User)
}