const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Project'
    },
    pushUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    },
    file: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProjectFile', schema, 'projectFile');