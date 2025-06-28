const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/user.model')
const apiError = require('../utils/ApiErrors')

exports.generateAccessToken = async(user) => {
  const secret = process.env.TOKEN_SECRET 
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role
  }
  const options = {expiresIn: '1h'}

  return jwt.sign(payload, secret, options)
}

exports.googleAuth = async(code) => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const REDIRECT_URI = process.env.REDIRECT_URI
  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

  // Ανταλλαγή code για token
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  // Επαλήθευση ID Token
  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: CLIENT_ID,
  })

  const payload = ticket.getPayload() // Google user info
  const email = payload.email

  // Αναζήτηση ή δημιουργία χρήστη στη βάση
  let user = await User.findOne({ email })

  if (user && user.password) {
    throw new apiError(409, 'Email already registered with password. Please login manually')
  }

  // Αν δεν υπάρχει, δημιουργία νέου χρήστη
  // Καθαρό username
  if (!user) {
    const baseUsername = payload.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

    // Εύρεση μοναδικού username
    let finalUsername = baseUsername;
    let counter = 1;
    while (await User.findOne({ username: finalUsername })) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }

    // Δημιουργία χρήστη
    user = new User({
      firstname: payload.given_name,
      lastname: payload.family_name,
      username: finalUsername,
      email: payload.email,
      role: 'user',
    })
    await user.save()
  }
  
  // Δημιουργία Access Token
  const accessToken = await this.generateAccessToken(user);

  // 5. Επιστροφή token και user info
  return {
    token: accessToken,
    user: {
      userId: user._id,
      username: user.username,
      role: user.role,
    }
  }
}