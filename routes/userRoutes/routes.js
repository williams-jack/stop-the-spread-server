// Sets up routes used by users.
const express = require("express");
const router = express.Router();

// User positive case reporting route.
const reportingRouter = require("./reporting");
router.use(reportingRouter);

// User locationHistory route.
const locationHistory = require("./locationHistory");
router.use("/locationHistory", locationHistory);

// User routes for getting business info.
const businessInfoRouter = require("./businessLocations");
router.use("/businessInfo", businessInfoRouter);

module.exports = router;
