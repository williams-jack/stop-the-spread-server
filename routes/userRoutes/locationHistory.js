// Routes for users to add a new location history entry, get previous entries, edit/delete an entry, etc.
const express = require("express");
const router = express.Router();
// Requires database access
const mongoose = require("mongoose");
const User = require("../../models/User");
const LocationHistoryEntry = require("../../models/LocationHistoryEntry");

router.get(
    "/entries",
    (async(req, res) => {
        // Return list of user's location entries.
        const currentUser = req.session.username;
        const entries = await User.findOne(
            {username : currentUser}
        ).select("locationHistory");
        //console.log(`entries: ${entries}`)
        res.status(200).send(entries);
    })
);

router.post(
    "/addEntry",
    (async(req, res) => {
        // Add an entry to the user's location history.
        const data = req.body;
        const currentUser = req.session.username;
        const userObj = await User.findOne(
            {username : currentUser}
        );

        try 
        {
            const newEntry = await LocationHistoryEntry.create({
                user: userObj._id,
                businessLocation: data.businessLocation,
                timeIn: data.timeIn,
                timeOut: data.timeOut
            });
            // await newEntry.save();
            userObj.locationHistory.push(newEntry._id);
            await userObj.save();
        } 
        catch (err) 
        {
            return res.status(500).json({message: "Unable to create entry", error: err});
        }

        res.sendStatus(200);
    })
);

router.post(
    "/editEntry",
    (async(req, res) => {
        // Edit an entry in the user's location history.

    })
);

router.delete(
    "/deleteEntry",
    (async(req, res) => {
        // Delete an entry in the user's location history.
        const currentUser = req.session.username;
        const userObj = await User.findOne(
            {username : currentUser}
        );

        try {
            // Try to delete the document.
            const entryId = new mongoose.Types.ObjectId(req.body.id);

            userObj.locationHistory.pull({_id: entryId});
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
