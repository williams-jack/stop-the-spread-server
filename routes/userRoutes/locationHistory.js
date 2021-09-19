// Routes for users to add a new location history entry, get previous entries, edit/delete an entry, etc.
const express = require("express");
const router = express.Router();
// Requires database access
const mongoose = require("mongoose");
const User = require("../../models/User");
const LocationHistoryEntry = require("../../models/LocationHistoryEntry");

router.get(
    "/entries",
    (async (req, res) => {
        // Return list of user's location entries.
        const currentUser = req.session.username;
        const userObj = await User.findOne(
            { username: currentUser }
        );

        let entries = [];
        for (let i = 0; i < userObj.locationHistory.length; i++) {
            entries.push(await LocationHistoryEntry.findById(userObj.locationHistory[i]));
        }

        res.status(200).send(entries);
    })
);

router.post(
    "/addEntry",
    (async (req, res) => {
        // Add an entry to the user's location history.
        const data = req.body;
        const currentUser = req.session.username;
        const userObj = await User.findOne(
            { username: currentUser }
        );

        try {
            // Check that the entry doesn't already exist.
            if (await LocationHistoryEntry.exists({
                user: userObj._id,
                businessLocation: data.businessLocation,
                timeIn: data.timeIn,
                timeOut: data.timeOut
            })) {
                return res.status(400).json({
                    message: "Entry already exists",
                });
            }

            const newEntry = await LocationHistoryEntry.create({
                user: userObj._id,
                businessLocation: data.businessLocation,
                timeIn: data.timeIn,
                timeOut: data.timeOut
            });
            userObj.locationHistory.push(newEntry._id);
            await userObj.save();
        }
        catch (err) {
            return res.status(500).json({ message: "Unable to create entry", error: err });
        }

        res.sendStatus(200);
    })
);

router.post(
    "/editEntry",
    (async (req, res) => {
        // Edit an entry in the user's location history.
        const data = req.body;
        const currentUser = req.session.username;
        const userObj = await User.findOne(
            { username: currentUser }
        );

        try {
            const entryId = new mongoose.Types.ObjectId(req.body.id);
            // Check that the location exists.
            if (!await LocationHistoryEntry.exists({ _id: entryId })) {
                return res.status(400).json({
                    message: "Location does not exist",
                });
            }

            let entry = await LocationHistoryEntry.findById(entryId);
            entry.set({
                user: userObj._id,
                businessLocation: data.businessLocation,
                timeIn: data.timeIn,
                timeOut: data.timeOut
            });
            await entry.save();

        } catch (error) {
            return res.status(500).json({ message: "Not able to update entry.", error: err });
        }

        res.status(200).json({ message: "Location updated." });
    })
);

router.delete(
    "/deleteEntry",
    (async (req, res) => {
        // Delete an entry in the user's location history.
        const currentUser = req.session.username;
        const userObj = await User.findOne(
            { username: currentUser }
        );

        try {
            // Try to delete the document.
            const entryId = new mongoose.Types.ObjectId(req.body.id);
            // Check that the location exists.
            if (!await LocationHistoryEntry.exists({ _id: entryId })) {
                return res.status(400).json({
                    message: "Entry does not exist",
                });
            }

            userObj.locationHistory.pull({ _id: entryId });
            await userObj.save();

            await LocationHistoryEntry.deleteOne({
                _id: entryId,
            });
        } catch (err) {
            return res.status(500).json({ message: "Not able to delete entry.", error: err });
        }

        res.status(200).json({ message: "Entry deleted." });
    })
);

module.exports = router
