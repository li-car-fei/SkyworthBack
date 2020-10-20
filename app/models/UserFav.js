const mongoose = require('mongoose');

// 类似关系型数据库的形式储存   用户收藏的 Article
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserFav', schema, 'userFav');