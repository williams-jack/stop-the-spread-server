// Routes for user reporting themselves as positive.
const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const sgMail = require('@sendgrid/mail');

router.post("/reportPositive", async (req, res) => {
    // User marks themselves as actively positive. Marked as inactive after [CDC Guideline]
    // number of days.
    // Other users notified. --> Should notification happen here or somewhere else? How can we do that
    // separately so that we can send user 200 without holding up the response?

    const currentUser = req.session.username;
    const userObj = await User.findOne(
        {username : currentUser}
    );

    const query = { username : currentUser };
    const positiveStatus = { $set: {activePositive: true} };
    await userObj.updateOne(query, positiveStatus);
    await userObj.save();

    res.status(200).send("A user has tested positive for COVID-19.");
    
    const userLocations = userObj.locationHistory;

    for (let i = 0; i < userLocations.length; i++) {
        const userLocation = userLocations[i];

        if (userLocation.Date <= userObj.dateIn - 14) {
            userLocations.remove(userLocation);
        }
    }

    notifyCloseContacts(userLocations);

});

const notifyCloseContacts = async (locationInformation) => {
    // Given and array of LocationHistoryEntries, find all users
    // who were at the location within that time frame and send them an email
    // informing them they have been in close contact with someone who tested positive.
    // Only locations for the past 14 days

    let usersToNotify = [];
    const users = await User.find();
    const PositiveLocations = locationInformation;
    for (let i = 0; i < locationInformation.length; i++) {
        const LocationHistoryEntry = locationInformation[i];
        const locationFromEntry = LocationHistoryEntry.businessLocation;

        for (let j = 0; j < users.length; j++) {
            const locationUser = users[j];

            if (locationFromEntry in locationUser.locationHistory) {
                const dateIn = Date.parse(LocationHistoryEntry.timeIn);
                const datePositive = Date.parse(locationUser.datePositive);
                const dateOut = Date.parse(LocationHistoryEntry.timeOut);

                if ((datePositive <= dateOut && datePositive >= dateIn) && !(locationUser in usersToNotify)) {
                        usersToNotify.push(locationUser);
                }
            }            
        }
    }

    for (let i = 0; i < users.length; i++) {
        emailUser = usersToNotify[i];
        sgMail.setApiKey("d-1ddc088bc46549ac9f7a0c8d0c59f240");
        const msg = {
            to: [emailUser.email],
            from: 'letsstopthespread@gmail.com',
            subject: '[ACTION REQUIRED] - Possible COVID-19 Exposure',
            text: 'Hello ' + emailUser.username + ', \nSomeone has tested positive for COVID-19 and was at the same location as you. Please get tested ASAP.\n\nSincerely, \nStop The Spread',
            html: '<p>Hello HTML world!</p>',
        };
        sgMail.send(msg);
    }
};


