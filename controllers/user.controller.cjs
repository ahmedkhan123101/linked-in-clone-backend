const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync.cjs');
const { User } = require('../models/index.cjs');

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
        return res.status(httpStatus.status.NOT_FOUND).send({ message: "User not found" });
    }

    res.status(httpStatus.status.OK).send(user);
});

const addExperience = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    user.experience.push(req.body);
    await user.save();
    res.status(httpStatus.status.CREATED).send(user);
});

const removeExperience = catchAsync(async (req, res) => {
    const { expId } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { experience: { _id: expId } } },
        { new: true }
    );
    res.status(httpStatus.status.OK).send(user);
});

const addEducation = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(httpStatus.status.NOT_FOUND).send({ message: "User not found" });
    }

    user.education.push(req.body);
    await user.save();

    res.status(httpStatus.status.CREATED).send(user);
});

const removeEducation = catchAsync(async (req, res) => {
    const { eduId } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { education: { _id: eduId } } },
        { new: true }
    );

    if (!user) {
        return res.status(httpStatus.status.NOT_FOUND).send({ message: "User not found" });
    }

    res.status(httpStatus.status.OK).send(user);
});

module.exports = { getUsers, updateProfile, addExperience, removeExperience, removeEducation, addEducation }