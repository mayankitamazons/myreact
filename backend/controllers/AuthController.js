const ResponseService = require('../shared/ResponseService'); // Response service
const User = require('../models/User'); // User model
const jwt = require("jsonwebtoken"); // JWT for tokens
const bcrypt = require("bcryptjs"); // Bcrypt for hashing
const _ = require("loadsh"); // Bcrypt for hashing
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var express = require('express');
var app = express();
const RESET_PASSWORD_KEY = 'resetpassword@1234'
const LoginMethods = Object.freeze({
    EMAIL: 1,
    MOBILE: 2
})

// User check,js ex
exports.userCheck = function (req, res) {
    // DB query for User
    var query = {};

    if (req.body.social_id) { // Social login
        query.social_id = req.body.social_id;
    } else { // Regular login
        if (req.body.login_method === LoginMethods.EMAIL) { // Email login
            query.email = req.body.username;
        } else if (req.body.login_method === LoginMethods.MOBILE) { // Mobile login
            query.mobile_no = req.body.username;
        }
    }

    User.findOne(
        query,
        (err, doc) => {
            if (doc) {
                // Remove password field
                delete doc._doc.password;

                // User exists
                ResponseService.generalPayloadResponse(err, doc, res)
            } else {
                // No user found
                ResponseService.generalResponse(err, res, 404, "User not found");
            }
        }
    )
};

// Signup
exports.signUp = function (req, res) {
    /* // DB query for User
     var query = {};
     
     if (req.body.social_id) { // Social login
     query.social_id = req.body.social_id;
     } else { // Regular login
     if (req.body.email) { // Email login
     query.email = req.body.email;
     } else if (req.body.mobile_no) { // Mobile login
     query.mobile_no = req.body.mobile_no;
     }
     } */

    // DB query for User
    var query = {
        $or: []
    };

    if (req.body.social_id) { // Social login
        query.$or.push({ social_id: req.body.social_id });
    }

    if (req.body.email) { // Email login
        query.$or.push({ email: req.body.email });
    }

    if (req.body.mobile_no) { // Mobile login
        query.$or.push({ mobile_no: req.body.mobile_no });
    }

    User.findOne(
        query,
        (err, doc) => {
            if (doc) {
                // Remove password field
                delete doc._doc.password;

                // change _id to user_id
                doc.user_id = doc._id;
                delete doc._doc._id;

                // User exists
                ResponseService.generalPayloadResponse(err, doc, res, 404, "User exists")
            } else {
                // No user found
                var user = new User(req.body);

                randomGen = false;
                // Password hashing BCRYPT
                if (user.password) {
                    user.password = bcrypt.hashSync(user.password, 10);
                } else {
                    randomPass = Math.random().toString(36).slice(-8);
                    user.password = bcrypt.hashSync(randomPass);
                    randomGen = true;
                }

                user.save((err, doc) => {

                    // Generate token
                    const token = jwt.sign({
                        id: doc._id
                    },
                        process.env.JWT_KEY
                    );

                    // Set new access token
                    doc.access_token = token;

                    // Remove password field
                    delete doc._doc.password;


                    ResponseService.generalPayloadResponse(
                        err,
                        (randomGen) ? { doc, randomPass } : doc,
                        res,
                        undefined,
                        "New user register"
                    )
                });
            }
        }
    )
}

// Login
exports.login = function (req, res) {
    // DB query for User
    var query = {};
    if (req.body.social_id) { // Social login
        query.social_id = req.body.social_id;
    } else { // Regular login
        if (req.body.login_method === LoginMethods.EMAIL) {
            // Email login
            query.email = req.body.username;
        } else if (req.body.login_method === LoginMethods.MOBILE) {
            // Mobile login
            query.mobile_no = req.body.username;
        } else {
            ResponseService.generalResponse("Invalid Request", res, 404, "Invalid request");
            return;
        }
    }


    User.findOne(
        query,
        (err, result) => {
            if (result) {
                // Set last login
                result.last_login = Date.now();

                if (result.status != 1) return ResponseService.generalResponse("User Account Deactivated", res, 404);

                if (req.body.notification_id) {
                    result.notification_id.push(req.body.notification_id);
                }

                result.save((err, data) => { });

                // Clone user doc
                var doc = new User(result);

                // store password temporary
                const pw = doc.password;
                // Remove password from return doc
                delete doc._doc.password;

                // Generate token
                const token = jwt.sign({
                    id: doc._id
                },
                    process.env.JWT_KEY
                );


                // Set new access token
                doc.access_token = token;

                if (req.body.social_id || (req.body.login_method === LoginMethods.MOBILE)) {
                    // User exists and social login
                    ResponseService.generalPayloadResponse(err, doc, res);
                } else {
                    // User exists and check password
                    if (bcrypt.compareSync(req.body.password, pw)) {

                        ResponseService.generalPayloadResponse(err, doc, res);
                    } else {
                        ResponseService.generalResponse(err, res, 404, "Invalid Email or Password");
                    }
                }

            } else {
                if (req.body.social_id) {
                    // No user found with social id
                    var user = new User(req.body);
                    // Password hashing BCRYPT
                    if (user.password) {
                        user.password = bcrypt.hashSync(user.password, 10);
                    }
                    user.save((err, doc) => {

                        // Generate token
                        const token = jwt.sign({
                            id: doc._id
                        },
                            process.env.JWT_KEY
                        );

                        // Set new access token
                        doc.access_token = token;

                        // Remove password field
                        delete doc._doc.password;

                        ResponseService.generalPayloadResponse(
                            err,
                            doc,
                            res,
                            undefined,
                            "New user register"
                        )
                    });
                } else if (req.body.login_method === LoginMethods.EMAIL) {
                    // No user found with email
                    ResponseService.generalResponse(err, res, 404, "Invalid Email or Password");
                } else {
                    // No user found with mobile
                    ResponseService.generalResponse(err, res, 404, "Invalid Mobile");
                }
            }
        }
    ).populate("doctor");

}

//Change password
exports.changePassword = function (req, res) {
    const { email, old_password, new_password, confirm_password } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            ResponseService.generalResponse("User with this token not exists.", res, 401, "User with this token not exists.");
            return;
        }

        let postconfirmpass = bcrypt.hashSync(confirm_password, 10);

        if (!bcrypt.compareSync(old_password, user.password)) {

            ResponseService.generalResponse("Old Password is wrong", res, 401, "Old Password is wrong.");
            return;
        }
        if (!bcrypt.compareSync(new_password, postconfirmpass)) {
            ResponseService.generalResponse("New password and confirm password not match", res, 401, "New password and confirm password not match.");
            return;
        }
        const obj = {
            password: postconfirmpass
        }

        user = _.extend(user, obj);
        user.save(function (err, result) {
            if (err) {
                ResponseService.generalResponse("Something went wrong.", res, 401, "Something went wrong.");
                return;
            } else {
                ResponseService.generalPayloadResponse(err, result, res);
                //ResponseService.generalResponse("Your password has been changed.", res, 200, "User with this token not exists.");
                return;
            }
        });


    });
}
//Reset Password with token

exports.resetPassword = function (req, res) {
    const { resetPasswordToken, newPass } = req.body;
    if (resetPasswordToken) {

        //        jwt.verify(resetPasswordToken, RESET_PASSWORD_KEY, function (err, decodedData) {
        //        
        //            if (err) {
        //                ResponseService.generalResponse("Incorrect Token or it is expired", res, 401, "Incorrect Token or it is expired");
        //                return;
        //            }
        User.findOne({ resetPasswordToken }, (err, user) => {
            if (err || !user) {
                ResponseService.generalResponse("User with this token not exists.", res, 401, "User with this token not exists.");
                return;
            }

            const obj = {
                password: bcrypt.hashSync(newPass, 10)
            }

            user = _.extend(user, obj);
            user.save(function (err, result) {
                if (err) {
                    ResponseService.generalResponse("User with this token not exists.", res, 401, "User with this token not exists.");
                    return;
                } else {
                    ResponseService.generalResponse("Your password has been changed.", res, 200, "User with this token not exists.");
                    return;
                }
            });
        });
        //});
    } else {
        ResponseService.generalResponse("Authentication Error", res, 401, "Authentication Error");
        return;
    }
}
// New forgot password API

exports.forgot_password = function (req, res) {
    const { email } = req.body;
    User.findOne({ email }, (err, user) => {

        if (err || !user) {
            ResponseService.generalResponse("User with this email not exists.", res, 401, "User with this email not exists");
            return;
        }

        //const token = jwt.sign({_id: user._id}, RESET_PASSWORD_KEY, {expiresIn: '20m'});
        //        const token = jwt.sign({
        //            _id: user._id
        //        },
        //                process.env.JWT_KEY
        //                );
        const token = bcrypt.hashSync(user._id.toString(), 10);

        var mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/auth/resetpasswords/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        return user.updateOne({ resetPasswordToken: token }, (err, success) => {
            if (err) {
                ResponseService.generalResponse("Reset Password link error", res, 401, "Reset Password link error");
                return;
            } else {
                return res.json({ "link": mailOptions.text, "token": token });
            }
        })

    });
}
// Forgot password
exports.forgot_request = function (req, res) {
    // DB query for User
    var query = {
        $or: []
    };
    if (req.body.social_id) { // Social login
        query.$or.push({ social_id: req.body.social_id });
    }

    if (req.body.email) { // Email login
        query.$or.push({ email: req.body.email });
    }

    if (req.body.mobile_no) { // Mobile login
        query.$or.push({ mobile_no: req.body.mobile_no });
    }

    User.findOne(query, (err, doc) => {
        if (!doc) {
            ResponseService.generalResponse(err, res, 404, "User not found!");
        } else {
            const temp_pass = bcrypt.hashSync(doc._id.toString(), 10);
            doc.temp_password = temp_pass;
            doc.save((err2, doc2) => {
                ResponseService.generalPayloadResponse(err2, { temp_password: doc2.temp_password }, res);
            })
        }
    })
}

// Reset password
exports.reset_password = function (req, res) {
    const hashed = bcrypt.hashSync(req.body.new_password, 10);
    User.findOneAndUpdate({ temp_password: req.body.temp_password }, { password: hashed }, { new: true }, (err, doc) => {
        ResponseService.generalResponse(err, res);
    })
}