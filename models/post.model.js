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
        commentCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


module.exports = mongoose.model('Post', postSchema);