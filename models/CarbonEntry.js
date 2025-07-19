const mongoose = require('mongoose');

const carbonEntrySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  entries: [
    {
      food: {
    type: {
      type: String,
      enum: ["Animal based", "Plant based", "Both"],
    },
    amountKg: {
      type: Number,
    },
    emissionKg: {
      type: Number,
    }
  },
      transport: [{
    mode: {
      type: String,
      enum: ["Car", "Bike", "Bus", "Metro", "Walking", "Train", "Flights"]
    },
    distanceKm: Number,
    emissionKg: Number
  }],
      electricity: [{
    consumptionKwh: Number,
    source: {
      type: String,
      enum: ["Coal", "Solar", "Wind", "Hydro", "Mixed"]
    },
    emissionKg: Number
  }],
      waste: [{
    plasticKg: Number,
    paperKg: Number,
    foodWasteKg: Number,
    emissionKg: Number
  }],
      totalEmissionKg: Number,
      suggestions: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('CarbonEntry', carbonEntrySchema);
