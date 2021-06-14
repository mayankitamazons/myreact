// User router
const app = require('express');
const router = app.Router();
const Types = require('../shared/Types') // Model types

// User controller
const userController = require('../controllers/UserController');

// Auth middleware
const CheckAuth = require('../shared/middleware/AuthMiddleware')

// CRUD Service
const CRUD = require('../shared/CRUD')
router.get('/all', (req, res) => userController.getAllUser({},
    req.query.limit ? parseInt(req.query.limit) : 1000,
    req.query.page ? parseInt(req.query.page) : 0,
    Types.USER,
    res));
router.get('/:id', (req, res) => CRUD.getById(req.params.id, Types.USER, res));
// User update
router.put('/:id', CheckAuth, userController.updateUser);

// User topics
router.post('/userhealth', CheckAuth, userController.userHealth);

// Hospitals
router.get('/:id/hospitals', CheckAuth, userController.hospitals);

// Favourite topic
router.post('/:id/fav_topic', CheckAuth, userController.favTopic);
//
// Favourite topic
router.post('/:id/fav_health', CheckAuth, userController.favHealth);

// Notification id
router.post('/notification_id', CheckAuth, userController.notificationID);

// Temporary delete
router.delete('/:id', CheckAuth, userController.deleteUser);

module.exports = router;