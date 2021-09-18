//
const mongoose = require("mongoose");

const LocationHistoryEntrySchema = new mongoose.Schema({
    businessLocation: {
        required: true,
        type: mongoose.SchemaTypes.ObjectId,
    },
    timeIn: {
        required: true,
        type: Date,
    },
    timeOut: {
        required: true,
        type: Date,
    },
});

module.exports = mongoose.model(
    "LocationHistoryEntry",
    LocationHistoryEntrySchema
);
