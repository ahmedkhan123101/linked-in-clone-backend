const express = require('express');
const validate = require('../../middlewares/validate.js')
const authValidation = require('../../validations/auth.validation.js')
const authController = require('../../controllers/auth.controller.js');
const auth = require('../../middlewares/auth.js');
const upload = require('../../middlewares/upload.js')

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);

router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshTokens);

router.get('/me', auth, (req, res) => {
    res.send(req.user)
});

router.patch('/me/avatar', auth, upload.single("image"), authController.updateAvatar);

module.exports = router;