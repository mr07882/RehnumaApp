const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  address: String,
  phone: String,
  password: String,
  // Add these new fields
  location: {
    lat: Number,
    lng: Number
  },
  nearbySupermarkets: [String]
});

module.exports = mongoose.model('User', userSchema);