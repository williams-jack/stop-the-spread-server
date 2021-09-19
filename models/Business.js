// Data(base) definition for an account owned by a business using our applications.
const mongoose = require("mongoose");
const BusinessSchema = new mongoose.Schema(
    {
        // Username for Business' account.
        username: {
            type: String,
            required: true,
            unique: true,
        },
        // Password for the Business' account.
        password: {
            type: String,
            required: true,
        },
        // Email associated with the business account.
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // Name of the business.
        businessName: {
            type: String,
            required: true,
        },
        // Locations of the business (i.e, franchises).
        // Array of AddressInformation.
        locations: {
            required: true,
            default: [],
            type: [mongoose.SchemaTypes.ObjectId],
        },
    },
    {
        collection: "businesses",
    }
);

module.exports = mongoose.model("", BusinessSchema);
