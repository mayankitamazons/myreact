const ResponseService = require('../shared/ResponseService'); // Response service
const async = require("async"); // Async function
var fs = require('fs');
const AWS = require('aws-sdk');
var ffmpeg = require('fluent-ffmpeg');

// Change these when uploading the code to S3 in AWS
const BUCKET_NAME = 'supernebr-images';
//const IAM_USER_KEY = 'AKIAXXXCF3ZBSWJ2O774';
//const IAM_USER_SECRET = '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';
// Save individual file to server
function saveFile(file, req, callback) {
    // identifier prefix
    const prefix = Date.now();

    // Directory
    const dir = './uploads/' + req.body.path;

    // Path to store file
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const pathToFile = dir + '/' + prefix + file.name

    // Url to access file
    const accessUrl = process.env.BASE_URL + req.body.path + '/' + prefix + encodeURIComponent(file.name);

    file.mv(pathToFile, function(err) {
        callback(err, accessUrl);
    });
}
async function uploadToS3(file, unique) {

    const fileContent = fs.readFileSync(file);

    /*let s3bucket = new AWS.S3({
    	accessKeyId: IAM_USER_KEY,
    	secretAccessKey: IAM_USER_SECRET,
    	Bucket: BUCKET_NAME
    });*/
    let s3bucket = new AWS.S3();

    var params = {
        Bucket: BUCKET_NAME,
        Key: unique + '.mp4',
        Body: fileContent,
        ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3bucket.upload(params, async function(err, data) {
        if (err) {
            throw err
        }
        console.log(`Video File uploaded successfully. ${data.Location}`)
    });
}
exports.uploadToS3Image = async function(file, unique) {

        const fileContent = fs.readFileSync(file);

        /*let s3bucket = new AWS.S3({
        	accessKeyId: IAM_USER_KEY,
        	secretAccessKey: IAM_USER_SECRET,
        	Bucket: BUCKET_NAME
        });*/
        let s3bucket = new AWS.S3();

        var params = {
            Bucket: BUCKET_NAME,
            Key: unique + '.png',
            Body: fileContent,
            ACL: 'public-read'
        };

        // Uploading files to the bucket
        s3bucket.upload(params, async function(err, data) {
            if (err) {
                throw err
            }
            return data.Location;
            console.log(`Image File uploaded successfully. ${data.Location}`)
        });
    }
    // Save individual file to server

async function removeVideoFile(req, unique, callback) {

    const dir = './uploads/' + req.body.path;
    console.log(dir + unique + ".mp4");
    if (!fs.existsSync(dir)) {
        console.log("file is here");
        let msg = "file is unlinked";
        callback('', msg);
    }

}
async function saveVideoFile(file, unique, req, callback) {
    // identifier prefix
    //var unique = Math.floor(100000 + Math.random() * 900000);
    const prefix = Date.now();

    const dir = './uploads/' + req.body.path;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    file.name = unique + ".mp4";

    const pathToFile = dir + '/' + file.name

    const accessUrl = process.env.BASE_URL + req.body.path + '/' + encodeURIComponent(file.name);

    const imagePath = process.env.BASE_URL + req.body.path;

    file.mv(pathToFile, async function(req, res, err) {
        let image = unique + ".png";

        ffmpeg(pathToFile).screenshot({
            count: 1,
            filename: image,
            folder: dir,
            size: '350x439'
        }).on('end', function() {

            const pathToFileImage = dir + '/' + unique + ".png";
            uploadToS3Image(pathToFileImage, unique);
        }).on('end', function() {
            const pathToFileImage = dir + '/' + unique + ".png";
            const pathToFileVideo = dir + '/' + unique + ".mp4";
            fs.unlinkSync(pathToFileVideo, unique);
            fs.unlinkSync(pathToFileImage, unique);
        });
        uploadToS3(pathToFile, unique);
        callback(err, imagePath + "/" + image);
    });

}

async function saveVideoFileV1(file, unique, req, callback) {
    // identifier prefix
    //var unique = Math.floor(100000 + Math.random() * 900000);
    const prefix = Date.now();

    const dir = './uploads/' + req.body.path;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    file.name = unique + ".mp4";

    const pathToFile = dir + '/' + file.name

    const accessUrl = process.env.BASE_URL + req.body.path + '/' + encodeURIComponent(file.name);

    const imagePath = process.env.BASE_URL + req.body.path;
    let data = {};
    file.mv(pathToFile, async function(req, res, err) {
        let image = unique + ".png";

        ffmpeg(pathToFile).screenshot({
            count: 1,
            filename: image,
            folder: dir,
            size: '350x439'
        }).on('end', function() {

            const pathToFileImage = dir + '/' + unique + ".png";
            //uploadToS3Image(pathToFileImage, unique);
        }).on('end', function() {
            const pathToFileImage = dir + '/' + unique + ".png";
            const pathToFileVideo = dir + '/' + unique + ".mp4";
            // data = {
            //     videoFile: pathToFileVideo,
            //     imageFile: pathToFileImage
            // }
            // fs.unlinkSync(pathToFileVideo, unique);
            // fs.unlinkSync(pathToFileImage, unique);
        });

        //uploadToS3(pathToFile, unique);
        callback(err, imagePath + "/" + image);
    });

}

// Upload file
exports.uploadFile = function(req, res) {
    // Check if there are files

    if (!req.files || Object.keys(req.files).length === 0) {
        ResponseService.generalResponse('No files', res, 500);
    }

    // functions
    var functions = [];

    // Check multiple files or single
    if (req.body.isMultiple === 'true') {
        req.files.files.forEach(file => {
            functions.push(function(callback) {
                saveFile(file, req, callback);
            });
        })
    } else {

        functions.push(function(callback) {
            saveFile(req.files.files, req, callback);
        });
    }

    async.parallel(functions, function(err, result) {
        ResponseService.generalPayloadResponse(err, result, res);
    });
}
exports.uploadVideoFile = function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        ResponseService.generalResponse('No files', res, 500);
    }
    var unique = Math.floor(100000 + Math.random() * 900000);
    var functions = [];
    // Check multiple files or single
    if (req.body.isMultiple === 'true') {
        req.files.files.forEach(file => {
            functions.push(function(callback) {
                saveVideoFileV1(file, unique, req, callback)
            });
        })
    } else {

        functions.push(function(callback) {
            saveVideoFileV1(req.files.files, unique, req, callback);
        });

    }

    async.parallel(functions, async function(err, result) {
        console.log(unique);

        let response = [];

        let amazonURL = process.env.BASE_URL + req.body.path + "/" + unique + ".mp4";
        let imageURL = process.env.BASE_URL + req.body.path + "/" + unique + ".png";
        response.push(imageURL);
        response.push(amazonURL);
        ResponseService.generalPayloadResponse(err, response, res);
        return;

    });
}
exports.uploadVideoFileS3 = function(req, res) {
    // Check if there are files
    if (!req.files || Object.keys(req.files).length === 0) {
        ResponseService.generalResponse('No files', res, 500);
    }
    var unique = Math.floor(100000 + Math.random() * 900000);
    // functions
    var functions = [];
    // Check multiple files or single
    if (req.body.isMultiple === 'true') {
        req.files.files.forEach(file => {
            functions.push(function(callback) {
                saveVideoFile(file, unique, req, callback)
            });
        })
    } else {

        functions.push(function(callback) {
            saveVideoFile(req.files.files, unique, req, callback);
        });
        functions.push(async function(callback) {
            await removeVideoFile(req, unique, callback);
        });

    }

    async.parallel(functions, async function(err, result) {
        console.log(unique);

        let response = [];
        //update the URLS to the new s3 bucket URL
        let amazonURL = "https://supernebr-images.s3.us-east-2.amazonaws.com/" + unique + ".mp4";
        let imageURL = "https://supernebr-images.s3.us-east-2.amazonaws.com/" + unique + ".png";
        response.push(imageURL);
        response.push(amazonURL);
        ResponseService.generalPayloadResponse(err, response, res);
        return;

    });
}