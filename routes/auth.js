// Authentication route endpoints for registration, login, and more.
// TODO: Switch password logic out with bcrypt password hashing logic
const express = require("express");
const { accountLoggedIn } = require("../middleware/routeAuth");
const Business = require("../models/Business");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
    // Check that username and password are in the JSON
    const role = req.body.role;
    const username = req.body.username;
    const password = req.body.password;

    // Check that fields exist
    if (!role || !username || !password) {
        res.sendStatus(400);
    }

    // Check if role is user or business
    if (role == "User") {
        // Attempt to find user in the database.
        const userEntry = await User.findOne({ username });
        if (userEntry) {
            // If found, check that passwords are the same.
            if (userEntry.password == password) {
                req.session.username = username;
                req.session.role = role;
                req.session.save();
                res.sendStatus(200);
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
                req.session.username = username;
                req.session.role = role;
                req.session.save();
                res.sendStatus(200);
            } else {
                res.status(400).json({
                    error: "The password was incorrect.",
                });
            }
        } else {
            // No business by that username. Send back bad request.
            res.status(400).json({
                error: "No Business account with that username.",
            });
        }
    } else {
        res.status(400).json({
            error: "Bad login role value.",
        });
    }
});

router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    const email = req.body.email;

    if (!role || !username || !password || !email) {
        return res.sendStatus(400);
    }

    if (role == "User") {
        // Make sure User with that username does not exist.
        const existingUser = await User.findOne({ username }).findOne({
            email,
        });
        if (existingUser) {
            return res.status(400).json({
                error: "User account with that username already exists.",
            });
        }

        // Create the User account.
        const newUser = await User.create({
            username,
            password,
            email,
        });

        // Save user info to session.
        req.session.username = username;
        req.session.role = role;
        req.session.save();

        res.sendStatus(200);
    } else if (role == "Business") {
        // Make sure business name is included:
        const businessName = req.body.businessName;
        if (!businessName) {
            return res.status(400).json({
                message: "Must include a business name.",
            });
        }
        // Ensure business with that username and email does not already
        // exist.
        const existingBusiness = await Business.findOne({ username }).findOne({
            email,
        });
        if (existingBusiness) {
            return res.status(400).json({
                error: "Business account with that username or email already exists.",
            });
        }

        // Create the new business account.
        const newBusiness = await Business.create({
            username,
            password,
            email,
            businessName,
        });

        req.session.username = username;
        req.session.role = role;
        req.session.businessName = businessName;
        req.session.save();

        return res.sendStatus(200);
    } else {
        res.status(400).json({
            error: "Invalid role.",
        });
    }
});

router.post("/logout", accountLoggedIn, async (req, res) => {
    // Logs the user out. Make sure they have a session that can be destroyed.
    await req.session.destroy();
    res.sendStatus(200);
});

module.exports = router;
