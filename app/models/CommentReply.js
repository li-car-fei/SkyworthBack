const mongoose = require('mongoose');

// 文章评论     回复评论
const schema = new mongoose.Schema({
    comment: {              // 处于的根评论的id
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Comment',
        required: true
    },
    replyType: {
        type: String,               // 回复类型，回复根评论或者回复他人的回复
        enum: ['comment', 'reply'],
        required: true
    },
    replyId: {              // 回复的id，如果回复类型是comment，则为空
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'CommentReply',
        default: null,
        required: false
    },
    user: {                 // 评论的用户
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    replyUser: {            // 回复的用户   如果回复类型是comment，则为空
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    content: {              // 内容
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CommentReply', schema, 'commentReply')