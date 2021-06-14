// Auth router
const app = require('express');
const router = app.Router();
const Types = require('../shared/Types') // Model types


// Auth controller
const authController = require('../controllers/AuthController');

// User controller
const userController = require('../controllers/UserController');

// CRUD Service
const CRUD = require('../shared/CRUD')

// User check route
router.post('/user_check', authController.userCheck);

// Signup route
router.post('/signup', authController.signUp);

// Login
router.post('/login', authController.login);
const CheckAuth = require('../shared/middleware/AuthMiddleware')
// Reset password Token

//app.Router('/resettoken/:token').get(authController.resetpasswordResponse);   
//router.get('/resettoken/:token', (req,res) => authController.resetpasswordResponse);   
//router.get('/resetpasswords/:token', authController.resetpasswords);
//router.post('/resetpasswords/:token', authController.resetpasswords);
// Auto login
router.get('/auto-login/:id', (req, res) => CRUD.getById(req.params.id, Types.USER, res));



// Logout
router.post('/logout', userController.notificationID);

// Reset password request
router.post('/reset_request', authController.forgot_request);
//new forgot password
router.post('/forgot_password', authController.forgot_password);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authController.changePassword);

// Reset password
//router.post('/reset', authController.reset_password);

module.exports = router;