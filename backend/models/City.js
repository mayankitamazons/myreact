const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	name: String,
	icon: String,
	location: {
		type: { type: String },
		coordinates: [Number, Number]
	},
	status: {
		type: Number,
		default: 1,
	},
});

Schema.index({ location: "2dsphere" });

module.exports = mongoose.model("City", Schema);
