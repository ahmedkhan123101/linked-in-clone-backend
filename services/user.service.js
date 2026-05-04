const User = require('../models/user.model.js');

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const getUserByEmail = async (email) => {

  return User.findOne({ email });
};

module.exports = { createUser, getUserByEmail };