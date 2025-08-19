const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  userId: String,
  latitude: String,
  longitude: String,
  timestamp: Date,
  plate: { type: String },
  ml: { type: Boolean},
});

const LocationModel = mongoose.model('Location', LocationSchema);

module.exports = LocationModel