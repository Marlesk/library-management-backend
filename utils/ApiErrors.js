class ApiError extends Error {
  constructor(status, message = 'Something went wrong', errors = null) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

module.exports = ApiError

