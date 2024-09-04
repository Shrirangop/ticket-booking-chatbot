const mongoose = require("mongoose");

require('dotenv').config();

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User_photo', Schema);

module.exports = {User};