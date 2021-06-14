// Home router
const app = require('express');
const router = app.Router();
const Types = require('../shared/Types') // Model types

// Blog controller
const blogController = require('../controllers/BlogController');

// CRUD Service
const CRUD = require('../shared/CRUD')

// Auth middleware
const CheckAuth = require('../shared/middleware/AuthMiddleware')

// Create
router.post("/", (req, res) => CRUD.create(req.body, Types.BLOG, res));


// Update
router.put("/:id", (req, res) =>
    CRUD.updateById(req.params.id, req.body, Types.BLOG, res)
);

// Get all
router.get("/", (req, res) =>
    CRUD.getByQueryPaginateWithoutSort(
        {},
        req.query.limit ? parseInt(req.query.limit) : 10,
        req.query.page ? parseInt(req.query.page) : 0,
        Types.BLOG,
        res
    )
);

// Get by id
router.get("/:id", (req, res) =>
    CRUD.getById(req.params.id, Types.BLOG, res)
);

module.exports = router;