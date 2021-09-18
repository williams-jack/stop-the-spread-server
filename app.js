// Main entry file into the application (server).
require("dotenv").config("./.env");
const express = require("express");
const db = require("./db");

// Attempt to connect to the database.
db.then(() => {
    console.log("Connected to the database.");
}).catch((err) => {
    console.error(err);
});

// Application creation/setup.
const PORT = process.env.PORT;
const app = express();

// Mount package middleware.
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

app.use(cors());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.APP_SECRET,
        saveUninitialized: false,
        resave: false,
        name: "SESSIONID",
        cookie: {
            httpOnly: true,
            expires: 24 * 60 * 60 * 1000,
            domain: process.env.APP_HOST || "localhost",
        },
        store: MongoStore.create({
            mongoUrl: `${process.env.DB_HOST}${process.env.DB_NAME}`,
        }),
    })
);

// Start application.
app.listen(PORT, () => {
    console.log(`Application listening on port ${PORT}`);
});
