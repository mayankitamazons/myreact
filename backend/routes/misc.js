// Misc router
const app = require('express');
const router = app.Router();
const Types = require('../shared/Types') // Model types

// Misc controller
const miscController = require('../controllers/MiscController');

// CRUD Service
const CRUD = require('../shared/CRUD')

// Auth middleware
const CheckAuth = require('../shared/middleware/AuthMiddleware')

// Get country list
router.get('/country_list', CheckAuth, miscController.countryList);

// Get document count with query
router.post('/:type/doc_count', CheckAuth, (req, res) => CRUD.countByQuery(req.body, Types[req.params.type], res));

module.exports = router;