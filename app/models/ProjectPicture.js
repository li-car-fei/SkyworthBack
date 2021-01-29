const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    // project: {                              // 图片所属项目
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'Project'
    // },
    catalog: {                                  // 图片所属目录
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ProjectCatalog'
    },
    file: {                                 // 图片地址
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('ProjectPicture', schema, 'projectPicture');