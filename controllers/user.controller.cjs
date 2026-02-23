const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync.cjs');
const { User } = require('../models/index.cjs');

const getUsers = catchAsync(async (req, res) => {
    const currentUserId = req.user.id
    const users = await User.find({ _id: { $ne: currentUserId } }).select('-password')
    res.send(users)
})

module.exports = { getUsers }