const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    members: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }]
});

module.exports = new mongoose.model('Team', schema, 'team')