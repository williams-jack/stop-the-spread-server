// Data(base) definition for a single entry in a user's location history.
const mongoose = require("mongoose");

const LocationHistoryEntrySchema = new mongoose.Schema(
    {
        // ObjectID of the user whose location history entry this belongs to.
        user: {
            required: true,
            type: mongoose.SchemaTypes.ObjectId,
        },
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
    },
    {
        collection: "locationhistoryentries",
    }
);

module.exports = mongoose.model(
    "LocationHistoryEntry",
    LocationHistoryEntrySchema
);
