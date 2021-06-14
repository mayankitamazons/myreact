const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    key: String,
    title: String,
    content: String,
    image: String,
    seo_title: String,
    seo_content: String,
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Page', Schema);