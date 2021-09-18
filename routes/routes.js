// File detailing all routes and the JS files that map to them.
const express = require("express");
const Router = express.Router();

// Authentication routes.
const authRouter = require("./auth");

// Business/User Security Middleware Module
const routeAuth = require("../middleware/routeAuth");

// User routes:
const userRoutesRouter = require("./userRoutes/routes");
Router.use("/user", userRoutesRouter, routeAuth.userRouteAuth);
