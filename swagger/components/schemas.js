const m2s = require('mongoose-to-swagger')
const User = require('../../models/user.model')
const Book = require('../../models/book.model')
const Borrow = require('../../models/borrow.model')
const Contact = require('../../models/contact.model')

module.exports = {
  User: m2s(User),
  Book: m2s(Book),
  Borrow: m2s(Borrow),
  Contact: m2s(Contact)
}