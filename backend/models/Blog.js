const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    description: String,
   
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Blog', Schema);