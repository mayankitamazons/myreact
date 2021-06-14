const ResponseService = require('../shared/ResponseService'); // Response service
const async = require("async"); // Async function
var fs = require('fs');
const AWS = require('aws-sdk');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path')

const BUCKET_NAME = 'tapshake';
const IAM_USER_KEY = 'AKIAXXXCF3ZBSWJ2O774';
const IAM_USER_SECRET = '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';

// Save individual file to server


async function uploadToS3(file, unique, extname) {

    const fileContent = fs.readFileSync(file);

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    });

    var params = {
        Bucket: BUCKET_NAME,
        Key: unique + extname,
        Body: fileContent,
        ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3bucket.upload(params, async function (err, data) {
        if (err) {
            throw err
        }
        console.log(`File uploaded successfully. ${data.Location}`)
    });
}

async function uploadToS3Image(file, unique) {

    const fileContent = fs.readFileSync(file);

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    });

    var params = {
        Bucket: BUCKET_NAME,
        Key: unique + '.png',
        Body: fileContent,
        ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3bucket.upload(params, async function (err, data) {
        if (err) {
            throw err
        }
        console.log(`Image File uploaded successfully. ${data.Location}`)
    });
}
// Save individual file to server

async function removeUploadedFile(req, unique, extname, callback) {

    const dir = './uploads/' + req.body.path;
    console.log(dir + unique + extname);
    if (!fs.existsSync(dir)) {
        console.log("file is here");
        let msg = "file is unlinked";
        callback('', msg);
    }

}
async function saveUploadedFile(file, unique, extName, req, callback) {
    // identifier prefix

    const prefix = Date.now();

    const dir = './uploads/' + req.body.path;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    file.name = unique + extName;

    const pathToFile = dir + '/' + file.name

    const accessUrl = process.env.BASE_URL + req.body.path + '/' + encodeURIComponent(file.name);

    const imagePath = process.env.BASE_URL + req.body.path;

    file.mv(pathToFile, async function (req, res, err) {
        let image = unique + extName;
        uploadToS3(pathToFile, unique, extName);
        let url = "https://tapshake.s3.ap-south-1.amazonaws.com/" + unique + extName;
        callback(err, url);
    });

}


exports.uploadFileS3 = function (req, res) {
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

            var unique = Math.floor(100000 + Math.random() * 900000);
            var fileExt = path.extname(file.name);
            functions.push(function (callback) {
                saveUploadedFile(file, unique, fileExt, req, callback)
            });
        })
    } else {
        var fileExt = path.extname(req.files.files.name);

        functions.push(function (callback) {
            saveUploadedFile(req.files.files, unique, fileExt, req, callback);
        });
    }

    async.parallel(functions, async function (err, result) {
        console.log(result);
        let response = [];
        let amazonURL = "https://tapshake.s3.ap-south-1.amazonaws.com/" + unique + fileExt;

        response.push(amazonURL);

        ResponseService.generalPayloadResponse(err, result, res);
        return;
    });
}