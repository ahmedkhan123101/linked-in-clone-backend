const httpStatus = require("http-status")
const userService = require('./user.service.js')
const ApiError = require('../utils/ApiError.js')
const Token = require('../models/token.model.js'); // Import the model
const { tokenTypes } = require('../config/tokens.js'); // Import the types

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email); //get from MongoDB
  if (!user || !(await user.isPasswordMatch(password))) { //Schema method for checking password with bcrypt
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false
  });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  await refreshTokenDoc.deleteOne();
};

module.exports = { loginUserWithEmailAndPassword, logout }