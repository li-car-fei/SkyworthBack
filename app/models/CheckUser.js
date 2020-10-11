const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,                 // 姓名
        require: true
    },
    password: {
        type: String,
        required: true,
    },
    sex: {
        type: String,                 // 性别
        required: true,
        enum: ['男', '女']
    },
    number: {
        type: String,                 // 学号
        required: true,
        match: [/^201[89]\d{8}$/, '学号不符合规范']
    },
    profession: {
        type: String,                     // 专业班级
        required: true,
    },
    phone: {
        type: String,
        required: true,
        match: [/^1[3456789]\d{9}$/, '手机号不符合规范']                  // 正则判断手机号
    },
});

module.exports = mongoose.model('CheckUser', schema, 'checkuser');