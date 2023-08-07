const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    //comment belongs to a user
    // here, linking the comment with the user
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // here , linking the comment to the post
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment',  commentSchema);
module.exports = Comment;