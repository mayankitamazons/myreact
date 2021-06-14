const ResponseService = require('../ResponseService'); // Response service
var fs = require('fs');

// Upload user profile picture
exports.uploadUserProfilePic = function(req, res, next) {
    // Check if there is a file
    if (!req.files || Object.keys(req.files).length === 0) {
        next();
    } else {
        var file = req.files.profile_pic;

        // identifier prefix
        const prefix = Date.now();

        // Directory
        const dir = './uploads/user/profile_pic';

        // Path to store file
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const pathToFile = dir + '/' + prefix + file.name

        // Url to access file
        const accessUrl = process.env.BASE_URL + 'user/profile_pic/' + prefix + encodeURIComponent(file.name);

        file.mv(pathToFile, function(err) {
            if (err) {
                ResponseService.generalResponse(err, res, 404, "Error in uploading profile picture");
            } else {
                req.body.profile_pic = accessUrl;
                next();
            }
        });
    }



}