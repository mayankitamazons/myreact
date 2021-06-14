const ResponseService = require("../shared/ResponseService"); // Response service
const User = require("../models/User"); // User model
const Health = require("../models/Health"); // Topic model
exports.favTopic = function (req, res) {
	query = {};
	if (req.body.isAdd) {
		query.$addToSet = { favourite_topics: req.body.topic_id };
	} else {
		query.$pull = { favourite_topics: req.body.topic_id };
	}

	User.findByIdAndUpdate(req.params.id, query, { new: true }, (err, doc) => {
		ResponseService.generalPayloadResponse(
			err,
			doc,
			res,
			undefined,
			"Added"
		);
	}).populate("favourite_topics", "name image");
};
exports.favHealth = function (req, res) {
	query = {};
	if (req.body.isAdd) {
		query.$addToSet = { favourite_health: req.body.topic_id };
	} else {
		query.$pull = { favourite_health: req.body.topic_id };
	}

	User.findByIdAndUpdate(req.params.id, query, { new: true }, (err, doc) => {
		ResponseService.generalPayloadResponse(
			err,
			doc,
			res,
			undefined,
			"Added"
		);
	}).populate("favourite_topics", "name image");
};

exports.userHealth = async function (req, res) {
	if (req.body.user) {
		try {
			const userData = await User.findById(req.body.user);
			const healthData = await Health.find();
			const reducedData = healthData.reduce(
				(result, item) => ({
					...result,
					[item["category"]]: [
						...(result[item["category"]] || []),
						item,
					],
				}),
				{}
			);
			const response = [];
			Object.keys(reducedData).forEach((data) => {
				const item = { name: data, list: [] };
				reducedData[data].forEach((element) => {
					const listItem = {
						_id: element._id,
						name: element.name,
						isFav: false,
					};
					userData.favourite_health.forEach((health) => {
						if (element.name === health.name) {
							listItem.isFav = true;
						}
					});
					if (!req.body.isFav) {
						item.list.push(listItem);
					} else {
						listItem.isFav && item.list.push(listItem);
					}
				});
				response.push(item);
			});
			console.log("response", response);
			ResponseService.generalPayloadResponse(null, response, res);
		} catch (err) {
			ResponseService.generalPayloadResponse(err, {}, res);
		}
	}
};

exports.notificationID = function (req, res) {
	query = {};
	if (req.body.isAdd) {
		query.$addToSet = { notification_id: req.body.notification_id };
	} else {
		query.$pull = { notification_id: req.body.notification_id };
	}

	User.findByIdAndUpdate(req.body.id, query, { new: true }, (err, doc) => {
		ResponseService.generalPayloadResponse(
			err,
			doc,
			res,
			undefined,
			"Done"
		);
	})
		.populate("favourite_topics", "name image")
		.populate("speciality");
};
exports.getAllUser = async function (query, limit, page, type, res) {
	const model = User;
	// console.log(res.req.query);
	limit = 1000;
	var filter = {};
	if (res.req.query.userRole) {
		var filter = {
			userRole: res.req.query.userRole,
		};
	}
	//console.log(filter);

	User.find(filter, (err, doc) => {
		ResponseService.generalPayloadResponse(err, doc, res);
	})
		.skip(page * limit)
		.limit(limit)
		.sort({
			_id: -1,
		})
		.populate("speciality");
};

exports.hospitals = async function (req, res) {
	const user = await User.findById(req.params.user);

	if (!user) return ResponseService.generalResponse("User not found", res, 404);

	if (user.UserRole != 5 || user.UserRole != 3) return ResponseService.generalResponse("Only Hospitals and Doctors can view this info", res, 404);

	return ResponseService.generalPayloadResponse(null, {}, res);
}

exports.updateUser = async function (req, res) {
	let user = await User.findById(req.params.id);

	if (!user) return ResponseService.generalResponse("User doesnt exist", res, 404);

	const fieldsToUpdate = req.body;

	let existUser = [];

	if (fieldsToUpdate.mobile_no) existUser = await User.find({ mobile_no: fieldsToUpdate.mobile_no, _id: { $ne: req.params.id } });

	if (fieldsToUpdate.email) existUser = await User.find({ email: fieldsToUpdate.email, _id: { $ne: req.params.id } });

	if (existUser.length) return ResponseService.generalResponse("User with same details exsist", res, 404);

	user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true });

	return ResponseService.generalPayloadResponse(null, user, res, 200, "User Updated");

}

// TEmporary delete
exports.deleteUser = async function (req, res) {
	await User.findByIdAndRemove(req.params.id);
	return ResponseService.generalResponse(null, res);
}
