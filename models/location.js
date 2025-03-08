const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    userId: String,
    latitude: Number,
    longitude: Number,
    timestamp: Date
  });
  
  const LocationModel = mongoose.model('Location', LocationSchema);
  
module.exports = LocationModel