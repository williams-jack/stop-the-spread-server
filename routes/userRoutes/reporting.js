// Routes for user reporting themselves as positive.
const express = require("express");
const User = require("../../models/User");
const router = express.Router();

router.post("/reportPositive", (req, res) => {
    // User marks themselves as actively positive. Marked as inactive after [CDC Guideline]
    // number of days.
    // Other users notified. --> Should notification happen here or somewhere else? How can we do that
    // separately so that we can send user 200 without holding up the response?

    const currentUser = req.session.username;
    const userObj = User.findOne(
        {username : currentUser}
    );

    const query = { username : currentUser };
    const positiveStatus = { $set: {activePositive: true} };
    userObj.updateOne(query, positiveStatus)

    res.status(200).send("A user has tested positive for COVID-19.");

});

const notifyCloseContacts = (locationInformation) => {
    // Given and array of LocationHistoryEntries, find all users
    // who were at the location within that time frame and send them an email
    // informing them they have been in close contact with someone who tested positive.

    let users = [];
    const PositiveLocations = userObj.locationHistory;
    for (i = 0; i < locationInformation.length; i++) {
        const LocationHistoryEntry = locationInformation[i];

        const locationUser = LocationHistoryEntry.user;

        const dateIn = Date.parse(LocationHistoryEntry.timeIn);
        const datePositive = Date.parse(locationUser.datePositive);
        const dateOut = Date.parse(LocationHistoryEntry.timeOut);

        if ((LocationHistoryEntry.businessLocation in PositiveLocations) && 
                (datePositive <= dateOut && datePositive >= dateIn)) {
            if (!(locationUser in users)) {
                users.push(locationUser);
            } 
        }
    }


};
