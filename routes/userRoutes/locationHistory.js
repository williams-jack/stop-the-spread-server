// Routes for users to add a new location history entry, get previous entries, edit/delete an entry, etc.
const express = require("express");
const router = express.Router();

router.get(
    "/entries",
    async((req, res) => {
        // Return list of user's location entries.
    })
);

router.post(
    "/addEntry",
    async((req, res) => {
        // Add an entry to the user's location history.
    })
);

router.post(
    "/editEntry",
    async((req, res) => {
        // Edit an entry in the user's location history.
    })
);

router.delete(
    "/deleteEntry",
    async((req, res) => {
        // Delete an entry in the user's location history.
    })
);
