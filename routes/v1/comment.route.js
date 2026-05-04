const express = require('express')
const router = express.Router({ mergeParams: true });
const auth = require('../../middlewares/auth.js')
const commentController = require('../../controllers/comment.controller.js')

router.post('/', auth, commentController.addComment)
router.get('/', auth, commentController.getComments)

module.exports = router;