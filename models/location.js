const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  userId: String,
  latitude: String,
  longitude: String,
  timestamp: Date,
  plate: { type: String }
});

const LocationModel = mongoose.model('Location', LocationSchema);

module.exports = LocationModel