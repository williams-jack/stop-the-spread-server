// Main entry file into the application (server).
require("dotenv").config("./.env");
const express = require("express");
const db = require("./db");

db.then(() => {
    console.log("Connected to the database.");
}).catch((err) => {
    console.error(err);
});

const PORT = process.env.PORT;

const app = express();

app.listen(PORT, () => {
    console.log(`Application listening on port ${PORT}`);
});
