// Model imports
const ResponseService = require("../shared/ResponseService"); // Response service
const User = require("../models/User"); // User model
const Topic = require("../models/Topic"); // Topic model
const Health = require("../models/Health"); // Health model

const Blog = require("../models/Blog"); // Blog model
const DoctorSpeciality = require("../models/DoctorSpeciality"); // DoctorSpeciality model
const Question = require("../models/Question"); // Question model
const Booking = require("../models/Booking"); // Booking model
const Page = require("../models/Page"); // Page model
const Contact = require("../models/Contact"); // Contact model
const FAQ = require("../models/FAQ"); // FAQ model
const Types = require("../shared/Types"); // Model types
const City = require("../models/City");
const Banner = require("../models/Banner");
const Enquiry = require("../models/Enquiry");

// Return model by type
function getModelByType(type) {
	switch (type) {
		case Types.USER:
			return User;
		case Types.TOPIC:
			return Topic;
		case Types.HEALTH:
			return Health;
		case Types.BLOG:
			return Blog;
		case Types.DOCTOR_SPECIALITY:
			return DoctorSpeciality;
		case Types.QUESTION:
			return Question;
		case Types.BOOKING:
			return Booking;
		case Types.PAGE:
			return Page;
		case Types.CONTACT:
			return Contact;
		case Types.FAQ:
			return FAQ;
		case Types.CITY:
			return City;
		case Types.BANNER:
			return Banner;
		case Types.ENQUIRY:
			return Enquiry;
	}
}

// Return new model instance by type
function createNewModelInstanceByName(type, val) {
	switch (type) {
		case Types.USER:
			return new User(val);
		case Types.TOPIC:
			return new Topic(val);
		case Types.HEALTH:
			return new Health(val);
		case Types.BLOG:
			return new Blog(val);
		case Types.DOCTOR_SPECIALITY:
			return new DoctorSpeciality(val);
		case Types.QUESTION:
			return new Question(val);
		case Types.BOOKING:
			return new Booking(val);
		case Types.PAGE:
			return new Page(val);
		case Types.CONTACT:
			return new Contact(val);
		case Types.FAQ:
			return new FAQ(val);
		case Types.CITY:
			return new City(val);
		case Types.BANNER:
			return new Banner(val);
		case Types.ENQUIRY:
			return new Enquiry(val);
	}
}

// Create
exports.create = function (val, type, res) {
	const model = createNewModelInstanceByName(type, val);
	model.save((err, doc) => {
		ResponseService.generalPayloadResponse(err, doc, res);
	});
};

// Update by ID
exports.updateById = function (id, val, type, res) {
	const model = getModelByType(type);
	model.findByIdAndUpdate(id, val, { new: true }, (err, doc) => {
		ResponseService.generalPayloadResponse(
			err,
			doc,
			res,
			undefined,
			"Updated"
		);
	});
};

// Delete by ID
exports.deleteById = function (id, type, res) {
	const model = getModelByType(type);
	model.findByIdAndDelete(id, (err, doc) => {
		ResponseService.generalResponse(err, res, undefined, "Deleted");
	});
};

// Status change by ID
exports.statusChangeById = function (id, type, res) {
	const model = getModelByType(type);
	model.findByIdAndUpdate(id, { status: 0 }, (err, doc) => {
		ResponseService.generalResponse(err, res, undefined, "Deleted");
	});
};

// Permanant Delete by ID
exports.perDelete = function (id, type, res) {
    const model = getModelByType(type);

    model.findByIdAndDelete(id, (err, doc) => {
        ResponseService.generalResponse(err, res, undefined, "Deleted");
    });
}

// Read one by ID
exports.getById = function (id, type, res) {
	const model = getModelByType(type);
	model.findById(id, (err, doc) => {
		ResponseService.generalPayloadResponse(err, doc, res);
	});
};

/* Read by query
	[X] PAGINATION
	[X] SORTING
	[X] LIMIT
*/
exports.getByQuery = function (query, type, res) {
	const model = getModelByType(type);
	model.find(query, (err, doc) => {
		ResponseService.generalPayloadResponse(err, doc, res);
	});
};

/* Read n items by query [ NO PAGINATION ]
	[X] PAGINATION
	[X] SORTING
	[/] LIMIT
*/
exports.getByQueryLimit = function (query, limit, type, res) {
	const model = getModelByType(type);
	model
		.find(query, (err, doc) => {
			ResponseService.generalPayloadResponse(err, doc, res);
		})
		.limit(limit);
};

/* Read n items by query [ NO PAGINATION ]
	[X] PAGINATION
	[/] SORTING
	[/] LIMIT
*/
exports.getByQueryLimitAndSort = function (query, limit, sortQuery, type, res) {
	const model = getModelByType(type);
	model
		.find(query, (err, doc) => {
			ResponseService.generalPayloadResponse(err, doc, res);
		})
		.sort(sortQuery)
		.limit(limit);
};

/* Read n items by query [ NO PAGINATION ]
	[X] PAGINATION
	[/] SORTING
	[X] LIMIT
*/
exports.getByQueryAndSort = function (query, sortQuery, type, res) {
	const model = getModelByType(type);
	model
		.find(query, (err, doc) => {
			ResponseService.generalPayloadResponse(err, doc, res);
		})
		.sort(sortQuery);
};

/* Read n items by query [ NO PAGINATION ]
	[/] PAGINATION
	[/] SORTING
	[/] LIMIT
*/
exports.getByQueryPaginate = function (
	query,
	limit,
	sortQuery,
	page,
	type,
	res
) {
	const model = getModelByType(type);
	model
		.find(query, (err, doc) => {
			ResponseService.generalPayloadResponse(err, doc, res);
		})
		.sort(sortQuery)
		.skip(page * limit)
		.limit(limit);
};

/* Read n items by query [ NO PAGINATION ]
	[/] PAGINATION
	[X] SORTING
	[/] LIMIT
*/
exports.getByQueryPaginateWithoutSort = function (
	query,
	limit,
	page,
	type,
	res
) {
	const model = getModelByType(type);
	model
		.find(query, (err, doc) => {
			ResponseService.generalPayloadResponse(err, doc, res);
		})
		.skip(page * limit)
		.limit(limit);
};

// SPECIAL METHODS
// Get doc count
exports.countByQuery = function (query, type, res) {
	const model = getModelByType(type);
	query.status = 1;
	model.countDocuments(query, (err, count) => {
		ResponseService.generalPayloadResponse(err, { count: count }, res);
	});
};
