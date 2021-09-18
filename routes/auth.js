// Authentication route endpoints for registration, login, and more.
// TODO: Switch password logic out with bcrypt password hashing logic
const express = require("express");
const Business = require("../models/Business");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
    // Check that username and password are in the JSON
    const role = req.body["role"];
    const username = req.body["username"];
    const password = req.body["password"];

    // Check if role is user or business
    if (role == "User") {
        // Attempt to find user in the database.
        const userEntry = await User.findOne({ username });
        if (userEntry) {
            // If found, check that passwords are the same.
            if (userEntry.password == password) {
                res.sendStatus(200);
                req.session.username = username;
                req.session.role = userEntry.role;
                req.session.save();
            } else {
                res.status(400).json({
                    error: "The password was incorrect.",
                });
            }
        } else {
            // No user by that username. Send back bad request.
            res.status(400).json({
                error: "No User account with that username.",
            });
        }
    } else if (role == "Business") {
        const businessEntry = await Business.findOne({ username });
        if (businessEntry) {
            // If found, check that passwords are the same.
            if (password == businessEntry.password) {
                res.sendStatus(200);
                req.session.username = username;
                req.session.role = userEntry.role;
                req.session.save();
            } else {
                res.status(400).json({
                    error: "The password was incorrect.",
                });
            }
        } else {
            // No business by that username. Send back bad request.
            req.status(400).json({
                error: "No Business account with that username.",
            });
        }
    } else {
        res.status(400).json({
            error: "Bad login role value.",
        });
    }
});

router.post("/register", async (req, res) => {});

router.post("/logout", async (req, res) => {
    // Logs the user out. Make sure they have a session that can be destroyed.
    if (req.session) {
        req.session.destroy();
        res.sendStatus(200);
    } else {
        res.status(400).json({
            error: "No one is currently logged in.",
        });
    }
});
