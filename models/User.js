const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    activePositive: {
        type: boolean,
        required: true,
        default: false,
    },
    // History of business location and times.
    locationHistory: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true,
        default: [],
    },
});

module.exports = mongoose.model("User", UserSchema);
