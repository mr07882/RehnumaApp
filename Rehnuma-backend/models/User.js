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
  resetCodeExpires: Date
});

module.exports = mongoose.model('User', userSchema);