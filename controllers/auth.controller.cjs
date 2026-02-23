const httpStatus = require('http-status')
const { userService, tokenService, authService } = require('../services/index.cjs'); // Adjust path if needed
const cloudinary = require('cloudinary').v2

const register = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body)
        const tokens = await tokenService.generateAuthTokens(user)
        res.status(httpStatus.status.CREATED).send({ user, tokens })
    }
    catch (error) {
        next(error)
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUserWithEmailAndPassword(email, password);
        const tokens = await tokenService.generateAuthTokens(user);
        res.status(200).send({ user, tokens });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    try {
        await authService.logout(req.body.refreshToken);
        res.status(httpStatus.status.NO_CONTENT).send();
    }
    catch (error) {
        next(error)
    }
}

const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file attached." })
        }
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: 'avatars',
        });

        // Update User in DB
        req.user.profilePicture = result.secure_url;
        await req.user.save();

        res.send(req.user);
    }
    catch (error) {
        next(error)
    }
}

module.exports = { register, login, logout, updateAvatar };