const httpStatus = require('http-status').default;
const catchAsync = require('../utils/catchAsync.js');
const { User } = require('../models/index.js');
const ApiError = require('../utils/ApiError.js');

const getUsers = catchAsync(async (req, res) => {
    const currentUserId = req.user.id
    const users = await User.find({ _id: { $ne: currentUserId } }).select('-password')
    res.send(users)
})

const updateProfile = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    res.status(httpStatus.OK).send(user);
});

const addExperience = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    user.experience.push(req.body);
    await user.save();
    res.status(httpStatus.CREATED).send(user);
});

const removeExperience = catchAsync(async (req, res) => {
    const { expId } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { experience: { _id: expId } } },
        { new: true }
    );
    res.status(httpStatus.OK).send(user);
});

const addEducation = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    user.education.push(req.body);
    await user.save();

    res.status(httpStatus.CREATED).send(user);
});

const removeEducation = catchAsync(async (req, res) => {
    const { eduId } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { education: { _id: eduId } } },
        { new: true }
    );

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    res.status(httpStatus.OK).send(user);
});

module.exports = { getUsers, updateProfile, addExperience, removeExperience, removeEducation, addEducation }
