const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    enquiry_for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: String,
    question: String,
    answer: String,
    status: {
        type: Number,
        default: 1
    }
},
    {
        timestamps: true
    });



module.exports = mongoose.model('Enquiry', Schema);
// updated code with field