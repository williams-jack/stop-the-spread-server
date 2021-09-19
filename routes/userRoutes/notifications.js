// Routes for users to view and delete notifications from the server
const express = require("express");
const router = express.Router();
// Requires database access
const mongoose = require("mongoose");
const User = require("../../models/User");

router.get("/getNotifications", async (req, res) => {
    // Allows the user to view their past notifications
    const currentUser = req.session.username;
    const userObj = await User.findOne(
        { username: currentUser }
    );

    res.status(200).send(userObj.notifications);
});

router.delete("/deleteNotifications", async (req, res) => {
    // Allows the user to delete past notifications
    const currentUser = req.session.username;
    const userObj = await User.findOne(
        { username: currentUser }
    );

    try {
        // Try to delete the notification
        const notificationId = new mongoose.Types.ObjectId(req.body.id);
        userObj.notifications.id(notificationId).remove();
        await userObj.save();
    } catch (error) {
        return res.status(500).json({ message: "Not able to delete entry.", error: err });
    }
});

module.exports = router;