const schemas = require('./components/schemas')
const securitySchemes = require('./components/securitySchemes')
const tags = require('./tags')
const users = require('./paths/users')
const auth = require('./paths/auth')
const adminUsers = require('./paths/admin-users')
const adminBooks = require('./paths/admin-books')
const books = require('./paths/books')
const googleAuth =  require('./paths/google-auth')

module.exports = {
  "components": {
    "schemas": schemas,
    "securitySchemes": securitySchemes
  },

  "security": [
    {"bearerAuth":[]}
  ],

  "openapi": "3.1.0",
  "info": {
    "version": "1.0.0",
    "title": "Library App",
    "description": "An application for creating users and choosing books",
    "contact": {
      "name": "API Support",
      "url": "https://aueb.gr",
      "email": "support@example.com"
    }
  },

  "servers": [
    {
      url: "http://localhost:3000",
      description: "Local server"
    },
    {
      url: "http://www.backend.aueb.gr",
      description: "Testing server"
    }
  ],

  "tags": tags,

  "paths": {
    ...users,
    ...books,
    ...adminUsers,
    ...adminBooks,
    ...auth,
    ...googleAuth
  } 

}