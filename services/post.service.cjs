const Post = require('../models/post.model.cjs');

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

module.exports = {
    createPost,
    queryPosts,
};