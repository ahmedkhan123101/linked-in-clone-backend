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

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',//_id of this Schema
    foreignField: 'post'//post field in Comment document.
})

module.exports = mongoose.model('Post', postSchema);