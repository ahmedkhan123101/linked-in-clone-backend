const httpStatus = require('http-status').default;
const config = require('../config/config.js');
const { userService, tokenService, authService } = require('../services/index.js');
const cloudinary = require('cloudinary').v2;
const catchAsync = require('../utils/catchAsync.js');
const ApiError = require('../utils/ApiError.js');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: Number(config.jwt.refreshExpMin) * 60 * 1000,
};

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.cookie('refreshToken', tokens.refresh.token, cookieOptions);
    res.status(httpStatus.CREATED).send({ user, access: tokens.access });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.cookie('refreshToken', tokens.refresh.token, cookieOptions);
    res.status(httpStatus.OK).send({ user, access: tokens.access });
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.cookies.refreshToken);
    res.clearCookie('refreshToken', cookieOptions);
    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.cookies.refreshToken);
    res.cookie('refreshToken', tokens.refresh.token, cookieOptions);
    res.status(httpStatus.OK).send({ access: tokens.access });
});

const updateAvatar = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No file attached.");
    }
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
        folder: 'avatars',
    });

    req.user.profilePicture = result.secure_url;
    await req.user.save();

    res.send(req.user);
});

module.exports = { register, login, logout, updateAvatar, refreshTokens };
