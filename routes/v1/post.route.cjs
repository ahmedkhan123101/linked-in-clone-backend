const express = require('express')
const multer = require('multer')
const router = express.Router()

const postController = require('../../controllers/post.controller.cjs')
const auth = require("../../middlewares/auth.cjs")

const { storage } = require('../../config/cloudinaryConfig.js')
const upload = multer({ storage: storage })

router.post('/', auth, upload.array('files', 5), postController.createPost)
router.get('/', auth, postController.getPosts)
router.post('/:postId/like', auth, postController.toggleLike)

module.exports = router;