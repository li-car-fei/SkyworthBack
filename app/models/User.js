const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,            // 查询不会返回
        set(value) {
            // 设置或更改时，加密
            return bcrypt.hashSync(value, 10);
        }
    },
    name: {
        type: String,                 // 姓名
        default: 'name111'
    },
    sex: {
        type: String,                 // 性别
        enum: ['男', '女']
    },
    number: {
        type: String,                 // 学号
        match: [/^201[89]\d{8}$/, '学号不符合规范']
    },
    profession: {
        type: String                     // 专业班级
    },
    level: {
        type: Number,
        required: true,
        max: [4, 'level 最大为4'],
        min: [1, 'level 最小为1']
    },
    phone: {
        type: String,
        match: [/^1[3456789]\d{9}$/, '手机号不符合规范']                  // 正则判断手机号
    },
    email: {
        type: String,
        match: [/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, '邮箱格式不正确']
    },
    avator: {
        type: String,
        default: 'http://127.0.0.1:7001/public/avator/demo.jpg'
    },
    team_in: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Team',
        default: undefined
    },
    project_in: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Project'
    }]
}, {
    timestamps: true                            // 自动添加 建立和更改的时间
});

module.exports = mongoose.model('User', schema, 'user');