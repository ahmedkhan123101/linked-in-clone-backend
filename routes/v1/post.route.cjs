const express = require('express')
const multer = require('multer')
const router = express.Router()
const postController = require('../../controllers/post.controller.cjs')
const auth = require("../../middlewares/auth.cjs")

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
})

router.post('/', auth, upload.single('file'), postController.createPost)
router.get('/', auth, postController.getPosts)

module.exports = router;