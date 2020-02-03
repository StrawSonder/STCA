const mongoose = require("mongoose");

const rankSchema = mongoose.Schema({
    userID: String,
    TC: String,
    SZ: String,
    RM: String,
    CB: String,
    role: String,
    fc: String
})

module.exports = mongoose.model("Rank", rankSchema);