const mongoose = require('mongoose');

const carbonEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },

  // 🛠️ Fixing food field structure
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

  // ✅ Array of multiple transport entries
  transport: [{
    mode: {
      type: String,
      enum: ["Car", "Bike", "Bus", "Metro", "Walking", "Train", "Flights"]
    },
    distanceKm: Number,
    emissionKg: Number
  }],

  // ✅ Array of electricity sources
  electricity: [{
    consumptionKwh: Number,
    source: {
      type: String,
      enum: ["Coal", "Solar", "Wind", "Hydro", "Mixed"]
    },
    emissionKg: Number
  }],

  // ✅ Array of different waste types
  waste: [{
    plasticKg: Number,
    paperKg: Number,
    foodWasteKg: Number,
    emissionKg: Number
  }],

  totalEmissionKg: {
    type: Number,
    required: true
  },

  suggestions: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CarbonEntry', carbonEntrySchema);
