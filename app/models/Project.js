const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    leader: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    file: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', schema, 'project');