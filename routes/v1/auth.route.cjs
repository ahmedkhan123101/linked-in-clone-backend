const express = require('express');
const validate = require('../../middlewares/validate.cjs')
const authValidation = require('../../validations/auth.validation.cjs')
const authController = require('../../controllers/auth.controller.cjs');
const auth = require('../../middlewares/auth.cjs');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);

router.post('/logout', authController.logout);
router.get('/me', auth, (req, res) => {
    res.send(req.user)
});

module.exports = router;