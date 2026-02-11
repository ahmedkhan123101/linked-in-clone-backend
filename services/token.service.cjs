const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config.cjs');
const { Token } = require('../models/index.cjs'); // Import the Token model

const generateToken = (userId, expires, type = "access", secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    };
    return jwt.sign(payload, secret);
};

// NEW: Function to store the token in the database
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

    // NEW: Save the refresh token to the DB so logout can find it later
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

module.exports = {
    generateToken,
    generateAuthTokens,
    saveToken // Exported for potential use in other services
};