const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: false
    },
    isTop: {                // 是否置顶
        type: Boolean,
        default: false
    },
    isShow: {               // 是否显示到公共
        type: Boolean,
        default: false
    },
    body: {
        type: String,
        required: true
    },
    MdContent: {
        type: String,
        required: true
    },
    read: {
        type: Number,
        default: 1
    },
    fav: {
        type: Number,
        default: 0
    },
    categories: [{              // 文章属于的分类的数组
        type: mongoose.SchemaTypes.ObjectId,       // 指向 外键
        ref: 'Category'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Article', schema, 'article');