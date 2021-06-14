const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    question: {
        type: String,
        index: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    answers: [{
        text: String,
        isCorrect: Boolean
    }],
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Question', Schema);