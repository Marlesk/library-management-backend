const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

exports.emailFormat = (email) => {
  return emailRegex.test(email);
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$]).{8,}$/;

exports.passwordFormat = (password) => {
  return passwordRegex.test(password)
}

