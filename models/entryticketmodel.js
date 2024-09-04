const mongoose = require("mongoose");

require('dotenv').config();

const entrySchema = mongoose.Schema({
    museum : {
        type: String,
        required: true
    },
    tickets : {
        type: Number,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    currtickets :{
        type: Number,
        required: true
    },

})

const entrytickets = mongoose.model('entrytickets', entrySchema);

module.exports = entrytickets;