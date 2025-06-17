const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isEmailFormatCorrect = (email) => {
  return emailRegex.test(email);
}

// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// if (!passwordRegex.test(password)) {
//   throw new apiError(400, "Password must be at least 8 characters long and include at least one letter and one number");
// }


module.exports = isEmailFormatCorrect