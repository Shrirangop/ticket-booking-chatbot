const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  museum:{
    type: String,
    required: true,
  },
  shows:{
    type: Array,
    required: true,
  },
  nooftickets:{
    type: Number,
    required: true,
  },
  userid:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('User', userSchema);
