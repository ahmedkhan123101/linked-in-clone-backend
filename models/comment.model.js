const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'Post', required: true
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)