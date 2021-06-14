const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    image: String,
    is_featured: Number,
    slug: String,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Topic', Schema);