const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Project'
    },
    requestUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    },
    detail: {
        type: String
    },
    currentQuestion: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProjectRequest', schema, 'projectRequest');