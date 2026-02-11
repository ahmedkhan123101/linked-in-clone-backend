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
        file: {
            type: Buffer,
            contentType: String,
        },
        likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
        comments: [{ type: mongoose.SchemaTypes.ObjectId }],
        fileSize: {
            type: Number,
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);