// Sets up routes used by businesses.
const express = require("express");
const router = express.Router();

// Business addressInformation route.
const addressInformation = require("./locations");
router.use("/locations", addressInformation);

module.exports = router;
