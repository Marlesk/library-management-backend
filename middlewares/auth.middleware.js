const jwt = require('jsonwebtoken')

exports.verifyToken = async(req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]
  const secret = process.env.TOKEN_SECRET

  if (!token) {
    return res.status(403).json({status: false, message: 'Access denied. No token provided.'})
  }

  try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch(error) {
    return res.status(401).json({status: false, message:'Invalid or expired token.', error: error.message})
  }

}

exports.verifyRole = function(requiredRole) {
  return function(req, res, next) {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.role != requiredRole) {
      return res.status(403).json({ message: 'Access denied'})
    }

    next()
  }
}