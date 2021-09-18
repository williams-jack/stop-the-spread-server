// File detailing all routes and the JS files that map to them.
const express = require("express");
const router = express.Router();

// TODO: Add session verification.

// Authentication routes.
const authRouter = require("./auth");
router.use(authRouter);

// Business/User Security Middleware Module
const routeAuth = require("../middleware/routeAuth");

// User routes:
const userRoutesRouter = require("./userRoutes/routes");
router.use("/user", userRoutesRouter, routeAuth.userRouteAuth);

module.exports = router;
