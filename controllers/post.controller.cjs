const httpStatus = require('http-status');
const { postService } = require('../services/index.cjs');
const catchAsync = require('../utils/catchAsync.cjs');
const { Post } = require('../models/index.cjs');

const createPost = catchAsync(async (req, res, next) => {
    const imgUrls = req.files ? req.files.map(file => file.path) : [];//return paths or []

    const post = await postService.createPost({
        content: req.body.content,
        author: req.user.id,
        images: imgUrls,//Array above
    });

    res.status(httpStatus.status.CREATED).send(post);
})

const getPosts = catchAsync(async (req, res) => {
    const posts = await postService.queryPosts();
    res.send(posts);
})

const toggleLike = catchAsync(async (req, res) => {
    // get post id from url and user id from my auth middleware
    const { postId } = req.params;
    const userId = req.user.id;

    // find post but only get the likes array so it's faster
    const post = await Post.findById(postId).select('_id likes');

    // safety check if post is even there
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }

    // check if i already liked it
    const isLiked = post.likes.includes(userId);

    // if liked then pull (remove) me, else add me to set (no duplicates)
    const update = isLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } };

    // update the db and get back the new list of likes
    const updatedPost = await Post.findByIdAndUpdate(postId, update, {
        new: true,
        runValidators: true
    }).select('likes');

    // send back the id, the array, and how many likes total
    res.status(httpStatus.status.OK).send({
        postId: updatedPost._id,
        likes: updatedPost.likes,
        count: updatedPost.likes.length
    });
});

module.exports = { getPosts, createPost, toggleLike };