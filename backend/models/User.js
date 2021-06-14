const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
	{
		first_name: String,
		last_name: String,
		profile_pic: String,
		amount: {
			type: Number,
			default: 10,
		},
		email: {
			type: String,
			index: true,
		},
		mobile_no: {
			type: String,
			index: true,
		},
		signup_type: Number,
		social_id: {
			type: String,
			index: true,
		},
		password: String,
		temp_password: String,
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		device_token: String,
		access_token: String,
		status: {
			type: Number,
			default: 1,
		},
		user_id: String,

		dob: {
			type: Date,
			default: "1970-01-01",
		},
		gender: String,
		last_login: Date,
		status: {
			type: Number,
			default: 1,
		},
		notification_id: [String],

		// User only attributes
		favourite_topics: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Topic",
			},
		],
		favourite_health: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Health",
			},
		],

		business_details: {
			name: String,
			email: String,
			mobile: String
		},

		// Doctor only attributes
		speciality: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "DoctorSpeciality",
			},
		],
		available: {
			type: Boolean,
			default: false,
		},
		clock_in: {
			type: Boolean,
			default: false,
		},
		send_notifcation: {
			type: Boolean,
			default: true,
		},
		year_of_graduation: Number,
		university_of_graduation: String,
		medical_certificate_url: String,
		syndicate_id_url: String,
		city_of_practice: String,

		// dr verified
		doctor_verified: {
			type: Boolean,
			default: false,
		},
		hospitals: [
			{
				from: Date,
				to: Date,
				name: String,
				description: String,
			},
		],

		added_by: {
			hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			added_date: { type: Date, default: Date.now }
		},

		times: [
			{
				from: String,
				to: String,
				day: String,
			},
		],
		country: {
			type: String,
			default: "",
		},
		city: String,
		city_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "City",
		},
		district: {
			type: String,
			default: "",
		},
		state: {
			type: String,
			default: "",
		},
		address: {
			type: String,
			default: "",
		},
		height: {
			type: String,
			default: "",
		},
		weight: {
			type: String,
			default: "",
		},
		bmi: {
			type: String,
			default: "",
		},
		smoker: {
			type: Boolean,
			default: false,
		},
		rating: Number,
		// 1 for admin ,2 for user , 3  for dr , 4 -for medical store , 5- hospital
		userRole: {
			type: Number,
			default: 2,
		},
		myStore: [{
			image: String,
			title: String,
			description: String
		}]
	},
	{
		timestamps: true,
	}
);

// Remove password ands rese
Schema.set("toJSON", {
	transform: function (doc, ret) {
		delete ret["password"];
		if (doc.userRole === 2) {
			delete ret["speciality"];
			delete ret["clock_in"];
			delete ret["hospitals"];
			delete ret["myStore"];
			delete ret["times"];
		} else {
			delete ret["favourite_topics"];
			delete ret["favourite_health"];
		}
		return ret;
	},
});

var autoPopulate = function (next) {
	this.populate("speciality");
	this.populate("favourite_topics", "name image");
	this.populate("favourite_health", "name image category");
	next();
};

Schema.pre("findOne", autoPopulate).pre("find", autoPopulate);

module.exports = mongoose.model("User", Schema);
