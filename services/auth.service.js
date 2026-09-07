const httpStatus = require('http-status').default;
const userService = require('./user.service.js');
const tokenService = require('./token.service.js');
const ApiError = require('../utils/ApiError.js');
const Token = require('../models/token.model.js');
const { tokenTypes } = require('../config/tokens.js');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
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

const refreshAuth = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No refresh token provided');
  }
  return tokenService.refreshAuth(refreshToken);
};

module.exports = { loginUserWithEmailAndPassword, logout, refreshAuth };
