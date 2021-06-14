const ResponseService = require('../shared/ResponseService'); // Response service
const Blog = require('../models/Blog'); // Blog model
const async = require('async'); // Async

// Get all
exports.getAll = function (req, res) {

    // Pagination parameters
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    Blog.find({status: 1}, (err, doc) => {
        ResponseService.generalPayloadResponse(err, doc, res);
    }).populate('topic', 'name -_id').select("-desc").skip(page * limit).limit(limit);
}

// Get by ID
exports.getById = function (req, res) {
    async.waterfall([
        function (callback) {
            // Find by id and populate topic name
            Blog.findOne({_id: req.params.id}, (err, doc) => {
                callback(err, doc);
            }).populate('topic', 'name');
        },
        function (fetched, callback) {
            // Get 5 recommended blogs
            Blog.find({topic: fetched.topic._id, _id: {$ne: fetched._id}}, (err, docs) => {
                fetched.recommended = docs;
                callback(err, fetched);
            }).populate('topic', 'name -_id').limit(5)
        }
    ], (err, result) => {
        ResponseService.generalPayloadResponse(err, result, res);
    })


}  

// Home screem slider
exports.getSliderHome = function (callback) {
    Blog.find({status: 1, is_main_slider: true}, (err, doc) => {
        callback(err, doc);
    }).populate('topic', 'name -_id').limit(5);
}

// Home screem articles
exports.getArticlesHome = function (callback) {
    Blog.find({status: 1, is_featured: 1}, (err, doc) => {
        callback(err, doc);
    }).populate('topic', 'name -_id').limit(5);
}