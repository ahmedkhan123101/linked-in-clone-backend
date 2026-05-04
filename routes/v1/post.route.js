const express = require('express')
const multer = require('multer')
const router = express.Router()

const postController = require('../../controllers/post.controller.js')
const auth = require("../../middlewares/auth.js")

const commentRoute = require('./comment.route.js')

const { storage } = require('../../config/cloudinaryConfig.js')
const upload = multer({ storage: storage })

router.post('/', auth, upload.array('files', 5), postController.createPost)
router.get('/', auth, postController.getPosts)
router.post('/:postId/like', auth, postController.toggleLike)
router.use('/:postId/comments', commentRoute)
router.get('/my-posts', auth, postController.getMyPosts)
router.delete('/:postId', auth, postController.deletePost);
router.patch('/:postId', auth, upload.array('files', 5), postController.updatePost);

module.exports = router;