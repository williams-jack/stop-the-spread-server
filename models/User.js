// Data(base) definition for a user's account information, including auth info and COVID details.
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
        // User's username.
        username: {
            type: String,
            required: true,
            unique: true
        },
        // User's password (hash).
        password: {
            type: String,
            required: true,
        },
        // User's email (so that they can be notified of a close contact).
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // Is the user actively positive?
        activePositive: {
            type: Boolean,
            required: true,
            default: false,
        },
        // The date/time in which they are reported positive.
        datePositive: {
            type: Date,
        },
        // History of business location and times.
        locationHistory: {
            type: [mongoose.SchemaTypes.ObjectId],
            required: true,
            default: [],
        },
        // Notifications the user has recieved
        notifications: {
            type: [NotificationSchema],
            default: [],
            required: true
        }
    },
    {
        collection: "users",
    }
);

const NotificationSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },
        dateSent: {
            type: Date,
            required: true,
            default: new Date()
        }
    }
);

module.exports = mongoose.model("User", UserSchema);
