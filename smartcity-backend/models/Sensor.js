const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['air', 'traffic', 'energy', 'water', 'noise'] },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sensor', sensorSchema);
