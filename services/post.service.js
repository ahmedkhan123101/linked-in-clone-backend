const Post = require('../models/post.model.js');

/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */
const createPost = async (postBody) => {
    return Post.create(postBody);
};

//Retreive posts
const queryPosts = async (currentUserId) => {
    const posts = await Post.find({ author: { $ne: currentUserId } })
        .populate('author', 'name lastName profilePicture').sort({ createdAt: -1 })
    return posts;
}

const queryUserPosts = async (userId) => {
    return await Post.find({ author: userId })
        .populate('author', 'name lastName profilePicture')
        .sort({ createdAt: -1 });
};

const deletePostById = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    if (post.author.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own posts');
    }
    await post.deleteOne();
    return post;
};

const updatePostById = async (postId, userId, updateBody) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    if (post.author.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You can only edit your own posts');
    }

    Object.assign(post, updateBody);

    await post.save();
    return post.populate('author', 'name lastName profilePicture');
};

module.exports = {
    createPost,
    queryPosts,
    queryUserPosts,
    deletePostById,
    updatePostById
};