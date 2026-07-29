const httpStatus = require('http-status').default;
const cloudinary = require('cloudinary').v2;
const { postService } = require('../services/index.js');
const catchAsync = require('../utils/catchAsync.js');
const { Post } = require('../models/index.js');
const ApiError = require('../utils/ApiError.js');

const uploadImagesToCloudinary = async (files = []) => {
    const uploads = files.map(file => {
        const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return cloudinary.uploader.upload(fileBase64, {
            folder: 'linkedinclone/posts',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ width: 1000, crop: 'limit' }],
        });
    });

    const results = await Promise.all(uploads);
    return results.map(result => result.secure_url);
};

const createPost = catchAsync(async (req, res) => {
    const imgUrls = await uploadImagesToCloudinary(req.files);

    const post = await postService.createPost({
        content: req.body.content,
        author: req.user.id,
        images: imgUrls,
    });

    res.status(httpStatus.CREATED).send(post);
})

const getPosts = catchAsync(async (req, res) => {
    const currentUserId = req.user.id
    const posts = await postService.queryPosts(currentUserId);
    res.send(posts);
})

const toggleLike = catchAsync(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId).select('_id likes');

    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }

    const isLiked = post.likes.includes(userId);

    const update = isLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } };

    const updatedPost = await Post.findByIdAndUpdate(postId, update, {
        new: true,
        runValidators: true
    }).select('likes');

    res.status(httpStatus.OK).send({
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
    res.status(httpStatus.NO_CONTENT).send();
});

const updatePost = catchAsync(async (req, res) => {
    let updatedImages = [];

    if (req.body.images) {
        updatedImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (req.files && req.files.length) {
        const newUrls = await uploadImagesToCloudinary(req.files);
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
