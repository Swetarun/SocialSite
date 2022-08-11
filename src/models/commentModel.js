const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {type: String, required: true, trim: true},
    userId: {type: String, required: true},
    postId: { type: String, required: true },
    commentId: { type: String, required: true },
    subComment: {type: Array, trim: true}

}, { timestamps: true })

module.exports = mongoose.model("Comment", commentSchema);