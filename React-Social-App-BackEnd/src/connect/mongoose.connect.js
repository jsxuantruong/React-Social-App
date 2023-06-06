require("dotenv").config();
const mongoose = require("mongoose");
const { DB_URL } = require("../contants");

async function connectMongoose() {
    await mongoose.connect(DB_URL);
}

module.exports = connectMongoose;
