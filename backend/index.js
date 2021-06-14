const express = require('express');
const router = require('./routes'); // Routing module
const app = express();
const port = process.env.PORT || 3000; // Port to run
var fs = require('fs');
require('dotenv').config();
// Connect to database
const mongoose = require('mongoose');
//require('dotenv').config({ path: 'ENV_FILENAME' });
require('dotenv').config({ path: './ecosystem.config.js' });
/*
mongoose.connect(
    'mongodb://localhost/ainode', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
);
*/
let MONGODB_URI = "mongodb+srv://@cluster0.chhg7.mongodb.net/"
let DB_NAME = "node_demo"
let USERNM = "arpit1011"
let PASS = "arpit1011"  

mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        user: USERNM,
        pass: PASS,
        dbName: DB_NAME
    })
    .then(() => {
        console.log('mongodb connected...')
    })
    .catch(err => console.log(err.message))

// Body parsing as JSON
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Enable cors
app.use('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update later
    // Allowed headers
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // Allowed request methods
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );
    next();
});

// File uploader setup
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

if (!fs.existsSync('./tmp')) {
    fs.mkdirSync('./tmp');
}

app.use(express.static('uploads')); // Uploads directory

const fileUpload = require('express-fileupload');
app.use(fileUpload({ // Tempory file folder
    useTempFiles: true,
    tempFileDir: './tmp/'
}));

// Testing endpoint
const Notification = require('./shared/NotificationService')
app.get('/test', async(req, res) => {
    return res.json({ "done": "working v6" });
});

// Routing module API v1
app.use('/v1', router);

app.listen(port, () => console.log(`Server listening on port ${port}!`));