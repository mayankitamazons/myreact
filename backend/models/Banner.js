const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
	title: String,
	sub_title: String,
	image: String,
	slug: String,
	button_text: String,

	button_action: {
		type: Number,
		default: 1,
	},
	search_key: {
		type: String,
		default: "",
	},
	status: {
		type: Number,
		default: 1,
	},
	banner_position: {
		type: Number,
		default: 1,
	},
	// 2 - for user, 3 - for doctor, 4- for pharmacian, 5- for hospital
	banner_for: {
		type: Number,
		default: 2,
	},
	uploaded_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	created_date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Banner", Schema);
