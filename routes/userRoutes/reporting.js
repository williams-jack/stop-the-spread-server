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
        datePositive: "2021-09-19T04:21:35.950Z"
    });

    await userObj.save();

    res.status(200).send("A user has tested positive for COVID-19.");
    
    const userLocationIDs = userObj.locationHistory;
    let userLocations = [];

    for (let i = 0; i < userLocationIDs.length; i++) {
        const userLocationID = userLocationIDs[i];
        const userLocation = await LocationHistoryEntry.findById(userLocationID);

        // if (Date.parse(userLocation.Date) > (Date.parse(userObj.dateIn) - 12096e5)) {
        //     userLocations.add(userLocation);
        // }

        userLocations.push(userLocation);
    }

    notifyCloseContacts(userLocations);

});

const notifyCloseContacts = async (locationInformation) => {
    // Given and array of LocationHistoryEntries, find all users
    // who were at the location within that time frame and send them an email
    // informing them they have been in close contact with someone who tested positive.

    let usersToNotify = [];
    const users = await User.find();
    const PositiveLocations = locationInformation;
    for (let i = 0; i < locationInformation.length; i++) {
        const LocationHistoryEntryObj = locationInformation[i];

        //console.log(LocationHistoryEntryObj);
        const locationFromEntry = LocationHistoryEntryObj.businessLocation;

        for (let j = 0; j < users.length; j++) {
            const locationUser = users[j];

            //console.log(locationUser);
            let locationUserHistory = locationUser.locationHistory;

            for (let k = 0; k < users.length; k++) {
                const location = await LocationHistoryEntry.findById(locationUserHistory[k]);
                locationUserHistory[k] = location.businessLocation;
            }

            // console.log(locationUserHistory);
            // console.log(locationFromEntry);
            if (locationUserHistory.includes(locationFromEntry)) {
                const dateIn = Date.parse(LocationHistoryEntryObj.timeIn);
                const datePositive = Date.parse(locationUser.datePositive);
                const dateOut = Date.parse(LocationHistoryEntryObj.timeOut);

                if ((datePositive <= dateOut && datePositive >= dateIn) && !(locationUser in usersToNotify)) {
                    usersToNotify.push(locationUser);
                }
            }
        }
    }

    for (let i = 0; i < usersToNotify.length; i++) {
        emailUser = usersToNotify[i];
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        console.log(emailUser.email);

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
