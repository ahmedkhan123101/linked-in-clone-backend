const express = require('express');
const auth = require('../../middlewares/auth.cjs');
const userController = require('../../controllers/user.controller.cjs');

const router = express.Router();

router.get('/', auth, userController.getUsers);

module.exports = router;