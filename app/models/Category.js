const mongoose = require('mongoose');


// 文章分类
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Category', schema, 'category');