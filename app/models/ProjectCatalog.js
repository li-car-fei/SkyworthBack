const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Project'
    },
    catalogPath: {                      // 目录路径
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProjectCatalog', schema, 'projectCatalog');