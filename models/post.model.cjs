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
        images: [{
            file: {
                type: Buffer,
            },
            contentType: {
                type: String,
            },
            fileSize: {
                type: Number,
            }
        }],
        likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
        comments: [{ type: mongoose.SchemaTypes.ObjectId }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);