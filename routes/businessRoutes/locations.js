// Routes for bussinesses to add new locations (addresses), get current addresses, edit/delete an address, etc.
const express = require("express");
const router = express.Router();
// Requires database access
const mongoose = require("mongoose");
const Business = require("../../models/Business");
const AddressInformation = require("../../models/AddressInformation");

router.get("/getLocations", async (req, res) => {
    // Return list of bussiness's locations.
    const currentBusinessUser = req.session.username;
    const locations = await Business.findOne(
        { username: currentBusinessUser }
    ).select("locations");
    res.status(200).send(locations);
});

router.post("/addLocation", async (req, res) => {
    // Add an entry to the bussiness's locations.
    const data = req.body;
    const currentBusinessUser = req.session.username;
    const businessObj = await Business.findOne(
        { username: currentBusinessUser }
    );

    try {
        // Check that the location doesn't already exist.
        if (await AddressInformation.exists({
            addressLineOne: data.addressLineOne,
            addressLineTwo: data.addressLineTwo,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
        })) {
            return res.status(400).json({
                message: "Location already exists",
            });
        }

        const newLocation = await AddressInformation.create({
            addressLineOne: data.addressLineOne,
            addressLineTwo: data.addressLineTwo,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
        });
        businessObj.locations.push(newLocation._id);
        await businessObj.save();
    }
    catch (err) {
        return res.status(500).json({ message: "Unable to add new location", error: err });
    }

    res.sendStatus(200);
});

router.post("/editLocation", async (req, res) => {
    // Edit an entry in the bussiness's locations.
    const data = req.body;
    const currentBusinessUser = req.session.username;
    const businessObj = await Business.findOne(
        { username: currentBusinessUser }
    );

    try {
        const locationId = new mongoose.Types.ObjectId(req.body.id);
        // Check that the location exists.
        if (!await AddressInformation.exists({ _id: locationId })) {
            return res.status(400).json({
                message: "Location does not exist",
            });
        }

        let location = await AddressInformation.findById(locationId);
        location.set({
            addressLineOne: data.addressLineOne,
            addressLineTwo: data.addressLineTwo,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode
        });
        await location.save();

    } catch (error) {
        return res.status(500).json({ message: "Not able to update location.", error: err });
    }

    res.status(200).json({ message: "Location updated." });
});

router.delete("/deleteLocation", async (req, res) => {
    // Delete an entry in the bussiness's locations.
    const currentBusinessUser = req.session.username;
    const businessObj = await Business.findOne(
        { username: currentBusinessUser }
    );

    try {
        // Try to delete the document.
        const locationId = new mongoose.Types.ObjectId(req.body.id);
        // Check that the location exists.
        if (!await AddressInformation.exists({ _id: locationId })) {
            return res.status(400).json({
                message: "Location does not exist",
            });
        }

        businessObj.locations.pull({ _id: locationId });
        await businessObj.save();

        await AddressInformation.deleteOne({
            _id: locationId,
        });
    } catch (err) {
        return res.status(500).json({ message: "Not able to delete location.", error: err });
    }

    res.status(200).json({ message: "Location deleted." });
});

module.exports = router