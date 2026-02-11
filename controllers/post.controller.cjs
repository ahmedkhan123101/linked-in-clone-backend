const httpStatus = require('http-status');
const { postService } = require('../services/index.cjs');
const catchAsync = require('../utils/catchAsync.cjs')

const createPost = catchAsync(async (req, res, next) => {
    const postData = {
        content: req.body.content,
        author: req.user.id,
    };
    if (req.file) {
        postData.file = req.file.buffer
        postData.contentType = req.file.mimetype
        postData.fileSize = req.file.size
    }
    const post = await postService.createPost(postData);
    res.status(httpStatus.status.CREATED).send(post);
})

const getPosts = catchAsync(async (req, res) => {
    const posts = await postService.queryPosts();
    res.send(posts);
})

module.exports = { getPosts, createPost };