const httpStatus = require('http-status')
const { userService, tokenService, authService } = require('../services/index.cjs'); // Adjust path if needed

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

module.exports = { register, login, logout };