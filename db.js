const mongoose = require("mongoose");

const db_uri = `${process.env.DB_HOST}${process.env.DB_NAME}`;

module.exports = mongoose.connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
