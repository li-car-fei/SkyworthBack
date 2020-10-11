const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2]            // 0:留言了还没查看     1:留言了且标记查看了    2:查看者或发送者收藏了此条留言
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', schema, 'message');