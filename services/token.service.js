const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config.js');
const { Token, User } = require('../models/index.js');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status').default;

const generateToken = (userId, expires, type = "access", secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    };
    return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};

const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpMin, 'minutes');
    const accessToken = generateToken(user._id, accessTokenExpires, 'access');

    const refreshTokenExpires = moment().add(config.jwt.refreshExpMin, 'minutes');
    const refreshToken = generateToken(user._id, refreshTokenExpires, 'refresh');

    await saveToken(refreshToken, user._id, refreshTokenExpires, 'refresh');

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    };
};

//for refreshing token
const refreshAuth = async (refreshToken) => {
    let payload;
    try {
        payload = jwt.verify(refreshToken, config.jwt.secret);
    } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }
    if (payload.type !== 'refresh') {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }
    const tokenDoc = await Token.findOne({ token: refreshToken, user: payload.sub, type: 'refresh', blacklisted: false });
    if (!tokenDoc) throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not found or revoked');
    await tokenDoc.deleteOne();
    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User no longer exists');
    return generateAuthTokens(user);
};

module.exports = {
    generateToken,
    generateAuthTokens,
    saveToken,
    refreshAuth,
};
