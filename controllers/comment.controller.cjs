const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync.cjs')
const { Comment, Post } = require('../models/index.cjs')
const ApiError = require('../utils/ApiError.js')

// Add comment to Post
const addComment = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const post = await Post.findById(postId)
    if (!post) {
        throw new ApiError(httpStatus.status.NOT_FOUND, "Post not found.")
    }
    //Create Comment in MongoDB
    const comment = await Comment.create({
        post: postId,
        author: req.user.id,
        content: content
    })
    await Post.findByIdAndUpdate(postId, {
        $inc: { commentCount: 1 }
    })
    //Send comment and some user info as response to add to list of 
    // comments instead of refreshing whole page by retreiving from db
    const populatedComment = await comment.populate('author', 'name lastName')//Take author id, check in Users, attach name, lastName
    res.status(httpStatus.status.CREATED).send(populatedComment)
})

//Get comments
const getComments = catchAsync(async (req, res) => {
    const { postId } = req.params
    const userId = req.user.id

    //Get comments for postId
    const comments = await Comment.find({ post: postId }).populate('author', 'name lastName').sort({ createdAt: -1 })
    const sortedComments = [
        ...comments.filter(c => c.author._id.toString() === userId),
        ...comments.filter(c => c.author._id.toString() !== userId)
    ]

    res.status(httpStatus.status.CREATED).send(sortedComments)
})

module.exports = { addComment, getComments };