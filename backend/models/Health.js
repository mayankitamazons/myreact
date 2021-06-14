const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    name_arb: {
        type: String,
        default: ''
    },
    image: String,
    is_featured: Number,
    slug: String,
    category: String,
    category_arb: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Health', Schema);