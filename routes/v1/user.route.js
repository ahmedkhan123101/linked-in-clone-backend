const express = require('express');
const auth = require('../../middlewares/auth.js');
const userController = require('../../controllers/user.controller.js');

const router = express.Router();

router.get('/', auth, userController.getUsers);
router.post('/me/education', auth, userController.addEducation);
router.post('/me/experience', auth, userController.addExperience);
router.patch('/me', auth, userController.updateProfile);
router.delete('/me/experience/:expId', auth, userController.removeExperience);
router.delete('/me/education/:eduId', auth, userController.removeEducation);

module.exports = router;