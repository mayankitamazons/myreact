const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	doctor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	problem_link: [String],
	problem_detail: String,
	consult_for: String,
	name: String,
	call_attempt: {
		type: Number,
		default: 0
	},
	amount: {
		type: Number,
		default: 10
	},
	age: Number,
	gender: String,
	specialist: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'DoctorSpeciality'
	}],
	type_of_consult: {
		type: String,
		default: "chat"
	},
	booking_time: Date,
	request_time: Date,
	booking_status: {
		type: String,
		default: 'Requested'
	},
	doctor_cancel_comment: String,
	payment_done: {
		type: Boolean,
		default: false
	},

	payment_fail: String,
	verify_data: {
		type: String,
		default: "pending"
	},
	verify_dob: {
		type: String,
		default: "pending"
	},
	show_consult: {
		type: Boolean,
		default: false
	},
	dr_accept_time: Date,
	// field updated for report 
	report_submit: {
		type: Boolean,
		default: false
	},
	report: [{
		doctor_report: String,
		follow_up_need: {
			type: Boolean,
			default: false
		},
		report_submit_time: Date,
		next_follow_up_date: Date,
		ref_need: {
			type: Boolean,
			default: false
		},
		refer_to_whome: String,
		report_lnk: [String],
		medicine: [{
			name: String,
			comment: String
		}]

	}],
	consult_status: {
		type: Number,
		default: 0
	},
	status: {
		type: Number,
		default: 1
	}
});

// Auto populate speciality field
var autoPopulateSpeciality = function (next) {
	this.populate('specialist');
	this.populate('user');
	next();
};

Schema
	.pre('findOne', autoPopulateSpeciality)
	.pre('find', autoPopulateSpeciality);

module.exports = mongoose.model('Booking', Schema);
// updated code with field