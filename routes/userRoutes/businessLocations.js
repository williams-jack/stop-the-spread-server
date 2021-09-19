const express = require("express");
const AddressInformation = require("../../models/AddressInformation");
const Business = require("../../models/Business");
const router = express.Router();

router.get("/businessNames", async (req, res) => {
    const businessNames = [];
    const businessEntries = await Business.find();

    for (i = 0; i < businessEntries.length; i++) {
        businessNames.push(businessEntries[i].businessName);
    }

    res.status(200).json({
        businessNames,
    });
});

router.get("/getBusinessLocations", async (req, res) => {
    const businessName = req.query.businessName;
    const addresses = [];
    if (!businessName) {
        return res.status(400).json({
            message:
                "Must give a business name to receive a list of locations.",
        });
    }

    const businessEntry = await Business.findOne({ businessName });
    for (i = 0; i < businessEntry.locations.length; i++) {
        const locationInfo = await AddressInformation.findById(
            businessEntry.locations[i]
        );
        addresses.push(locationInfo);
    }

    res.status(200).json({
        addresses,
    });
});

module.exports = router;
