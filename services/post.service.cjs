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
const queryPosts = async () => {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 })
    return posts;
}

module.exports = {
    createPost,
    queryPosts,
};