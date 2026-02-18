const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        author: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        images: {
            type: [String],
            default: []
        },
        likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
        comments: [{ type: mongoose.SchemaTypes.ObjectId }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);