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
    const currentUserId = req.user.id
    const posts = await postService.queryPosts(currentUserId);
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

const getMyPosts = catchAsync(async (req, res) => {
    const posts = await postService.queryUserPosts(req.user.id);
    res.send(posts);
});

const deletePost = catchAsync(async (req, res) => {
    await postService.deletePostById(req.params.postId, req.user.id);
    res.status(httpStatus.status.NO_CONTENT).send();
});

const updatePost = catchAsync(async (req, res) => {

    // req.body.images contains the existing URLs kept by the user
    // req.files contains the new files uploaded to Cloudinary

    let updatedImages = [];

    // Add existing images.
    if (req.body.images) {//existing post urls.
        updatedImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    // Add new cloudinary urls.
    if (req.files) {//new images.
        const newUrls = req.files.map(file => file.path);
        updatedImages = [...updatedImages, ...newUrls];
    }

    const updateData = {
        content: req.body.content,
        images: updatedImages
    };

    const post = await postService.updatePostById(req.params.postId, req.user.id, updateData);
    res.send(post);
});

module.exports = { getPosts, createPost, toggleLike, getMyPosts, deletePost, updatePost };