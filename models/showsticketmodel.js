const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    museum : {
        type: String,
        required: true
    },
    showname : {
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
});

module.exports = mongoose.model('show', showSchema);
