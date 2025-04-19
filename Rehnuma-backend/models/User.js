const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  address: String,
  phone: String,
  password: String,
  location: {
    lat: Number,
    lng: Number
  },
  nearbySupermarkets: [{
    name: String,
    address: String,
    location: {
      lat: Number,
      lng: Number
    }
  }],
  resetCode: String,
  resetCodeExpires: Date,
  plans: [{
    name: String,
    data: Object,
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', userSchema);