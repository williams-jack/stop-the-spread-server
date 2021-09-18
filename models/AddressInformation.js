// Data(base) definition for an address.
// Currently only implemented by business accounts.
const mongoose = require("mongoose");

const AddressInformationSchema = new mongoose.Schema({
    addressLineOne: {
        required: true,
        type: String,
    },
    addressLineTwo: {
        required: false,
        type: String,
    },
    city: {
        required: true,
        type: String,
    },
    state: {
        length: 2,
        type: String,
        required: true,
    },
    zipCode: {
        length: 5,
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("AddressInformation", AddressInformationSchema);
