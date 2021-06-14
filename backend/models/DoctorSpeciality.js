const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    name_arb: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 1
    },
    description: String
});

module.exports = mongoose.model('DoctorSpeciality', Schema);