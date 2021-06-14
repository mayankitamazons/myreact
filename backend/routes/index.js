const app = require("express");
const router = app.Router();
const Types = require("../shared/Types"); // Model types

// CRUD Service
const CRUD = require("../shared/CRUD");

// Auth middleware
const CheckAuth = require("../shared/middleware/AuthMiddleware");

// API v1 routes

// Auth routes
const AuthRoutes = require("./authRoutes");
router.use("/auth", AuthRoutes);

// User routes
const UserRoutes = require("./userRoutes");
router.use("/user", UserRoutes);

// Blog routes
const BlogRoutes = require("./blogRoutes");
router.use("/blog", BlogRoutes);
// Misc routes
const MiscRoutes = require("./misc");
router.use("/", MiscRoutes);
// All delete route
router.delete("/delete/:type/:id", CheckAuth, (req, res) =>
    CRUD.statusChangeById(req.params.id, Types[req.params.type], res)
);

// permant delete   
router.delete('/deleteper/:type/:id', CheckAuth, (req, res) => CRUD.perDelete(req.params.id, Types[req.params.type], res));
module.exports = router;