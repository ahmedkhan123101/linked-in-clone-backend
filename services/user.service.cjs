const User = require('../models/user.model.cjs');

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const getUserByEmail = async (email) => {

  return User.findOne({ email });
};

module.exports = { createUser, getUserByEmail };