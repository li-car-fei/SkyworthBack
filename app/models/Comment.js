const mongoose = require('mongoose');

// 文章评论     评论的根评论    通过连表查询出此评论是否有reply
const schema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Article',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Comment', schema, 'comment');