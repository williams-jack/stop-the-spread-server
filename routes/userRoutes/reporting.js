// Routes for user reporting themselves as positive.
const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const LocationHistoryEntry = require("../../models/LocationHistoryEntry");

router.post("/reportPositive", async (req, res) => {
    // User marks themselves as actively positive. Marked as inactive after [CDC Guideline]
    // number of days.
    // Other users notified. --> Should notification happen here or somewhere else? How can we do that
    // separately so that we can send user 200 without holding up the response?

    const currentUser = req.session.username;
    const userObj = await User.findOne(
        {username : currentUser}
    );

    userObj.set({
        activePositive: true,
        datePositive: new Date()
    });

    await userObj.save();

    res.status(200).send("A user has tested positive for COVID-19.");
    
    const userLocationIDs = userObj.locationHistory;
    let userLocations = [];

    for (let i = 0; i < userLocationIDs.length; i++) {
        const userLocationID = userLocationIDs[i];
        const userLocation = await LocationHistoryEntry.findById(userLocationID);

        if (Date.parse(userLocation.timeOut) > (Date.parse(userObj.datePositive) - 12096e5)) {
            userLocations.push(userLocation);
        }
    }

    notifyCloseContacts(userLocations, userObj.datePositive);

});

const notifyCloseContacts = async (locationInformation, datePositive) => {
    // Given an array of LocationHistoryEntries and the time of Positive test, find all users
    // who were at the location within 14 days before that time and send them an email
    // informing them they may have been in close contact with someone who tested positive.

    let usersToNotify = [];
    const users = await User.find();
    for (let i = 0; i < locationInformation.length; i++) {
        const LocationHistoryEntryObj = locationInformation[i];

        const locationFromEntry = LocationHistoryEntryObj.businessLocation;

        for (let j = 0; j < users.length; j++) {
            const locationUser = users[j];

            let locationUserHistory = locationUser.locationHistory;

            for (let k = 0; k < users.length; k++) {
                const location = await LocationHistoryEntry.findById(locationUserHistory[k]);
                locationUserHistory[k] = location.businessLocation;
            }

            if (locationUserHistory.includes(locationFromEntry)) {
                const dateIn = Date.parse(LocationHistoryEntryObj.timeIn);
                const datePositiveTimeStamp = Date.parse(datePositive);
                const dateOut = Date.parse(LocationHistoryEntryObj.timeOut);

                if ((dateIn > datePositiveTimeStamp - 12096e5 || dateOut > datePositiveTimeStamp - 12096e5) && !(usersToNotify.includes(locationUser))) {
                    usersToNotify.push(locationUser);
                }
            }
        }
    }

    for (let i = 0; i < usersToNotify.length; i++) {
        emailUser = usersToNotify[i];
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: [emailUser.email],
            from: 'letsstopthespread@gmail.com',
            subject: '[ACTION REQUIRED] - Possible COVID-19 Exposure',
            text: 'Hello ' + emailUser.username + ', \nSomeone has tested positive for COVID-19 and was at the same location as you. Please get tested ASAP.\n\nSincerely, \nStop The Spread',
            html: '<p>Hello ' + emailUser.username + ', </p><p>Someone has tested positive for COVID-19 and was at the same location as you. Please get tested ASAP.</p><p>Sincerely, </p><p>The Stop The Spread Team</p>',
        };

        sgMail.send(msg).then(res => {
            //console.log(res.body.errors);
        }).catch(err => {
            console.error(err);
        });
        
    }
};

module.exports = router;
