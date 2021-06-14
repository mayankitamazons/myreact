const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    question: String,
    answer: String,
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('FAQ', Schema);