const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Contact', Schema);