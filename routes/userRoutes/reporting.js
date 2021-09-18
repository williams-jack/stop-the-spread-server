// Routes for user reporting themselves as positive.
const express = require("express");
const router = express.Router();

router.post("/reportPositive", (req, res) => {
    // User marks themselves as actively positive. Marked as inactive after [CDC Guideline]
    // number of days.
    // Other users notified. --> Should notification happen here or somewhere else? How can we do that
    // separately so that we can send user 200 without holding up the response?
});

const notifyCloseContacts = (locationInformtaion) => {
    // Given and array of LocationHistoryEntries, find all users
    // who were at the location within that time frame and send them an email
    // informting them they have been in close contact with someone who tested positive.
};
