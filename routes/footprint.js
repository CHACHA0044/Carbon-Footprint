const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authmiddleware');
const CarbonEntry = require('../models/CarbonEntry');

// ✅ POST: Create entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;

    // FOOD
    let foodEmission = 0;
    if (data.food) {
      const { type, amountKg } = data.food;
      const factor = 
        type === 'Animal based' ? 6.0 :
        type === 'Plant based' ? 1.5 :
        3.8;
      if (amountKg) foodEmission = factor * amountKg;
    }

    // TRANSPORT
    let transportTotal = 0;
    const transportWithEmissions = [];
    (data.transport || []).forEach(item => {
      const { mode, distanceKm } = item;
      const factor = {
        Car: 0.192,
        Bike: 0.016,
        Bus: 0.089,
        Metro: 0.041,
        Walking: 0.00,
        Train: 0.049,
        Flights: 0.254
      }[mode] || 0;

      const emissionKg = factor * distanceKm;
      transportTotal += emissionKg;
      transportWithEmissions.push({ mode, distanceKm, emissionKg });
    });

    // ELECTRICITY
    let electricityTotal = 0;
    const electricityWithEmissions = [];
    (data.electricity || []).forEach(item => {
      const { source, consumptionKwh } = item;
      const factor = {
        Coal: 0.94,
        Solar: 0.05,
        Wind: 0.01,
        Hydro: 0.02,
        Mixed: 0.45
      }[source] || 0;

      const emissionKg = factor * consumptionKwh;
      electricityTotal += emissionKg;
      electricityWithEmissions.push({ source, consumptionKwh, emissionKg });
    });

    // WASTE
    let wasteTotal = 0;
    const wasteWithEmissions = [];
    (data.waste || []).forEach(item => {
      const plasticKg = item.plasticKg || 0;
      const paperKg = item.paperKg || 0;
      const foodWasteKg = item.foodWasteKg || 0;

      const emissionKg =
        plasticKg * 5.8 +
        paperKg * 1.3 +
        foodWasteKg * 2.5;

      wasteTotal += emissionKg;
      wasteWithEmissions.push({ plasticKg, paperKg, foodWasteKg, emissionKg });
    });

    // TOTAL + SUGGESTIONS
    const totalEmissionKg = parseFloat(
      (foodEmission + transportTotal + electricityTotal + wasteTotal).toFixed(2)
    );

    let suggestions = '';
    if (totalEmissionKg <= 300) {
      suggestions =
        "🎉 Great job! Your monthly carbon footprint is well below average. Keep up your sustainable lifestyle, and consider going even further — like planting trees, reducing plastic use, or helping others calculate their footprint.";
    } else {
      if (foodEmission > 80) {
        suggestions += '🥩 Try reducing meat and dairy intake, and explore more plant-based meals. ';
      } else if (foodEmission > 40) {
        suggestions += '🥗 Great start! Reducing portion sizes or mixing with more plant-based meals can help. ';
      }

      if (transportTotal > 100) {
        suggestions += '🚗 Consider using public transport, carpooling, or biking for shorter trips. ';
      } else if (transportTotal > 50) {
        suggestions += '🚌 Good effort! Try reducing car use a bit more if possible. ';
      }

      if (electricityTotal > 100) {
        suggestions += '⚡ Switch to energy-efficient appliances or renewable energy if you can. ';
      } else if (electricityTotal > 50) {
        suggestions += '💡 Try reducing device standby time or using solar alternatives. ';
      }

      if (wasteTotal > 50) {
        suggestions += '🗑️ Reduce single-use plastics and improve recycling habits. ';
      } else if (wasteTotal > 30) {
        suggestions += '♻️ Consider composting and reusing more at home. ';
      }

      suggestions += '🌱 Every small step helps. Keep making eco-friendly choices and inspire others too!';
    }

    const newEntry = await CarbonEntry.create({
      user: userId,
      food: data.food,
      transport: transportWithEmissions,
      electricity: electricityWithEmissions,
      waste: wasteWithEmissions,
      totalEmissionKg,
      suggestions,
      email: req.user.email
    });

    console.log("✅ Emission entry saved:", newEntry._id);

    res.status(201).json({
      message: 'Entry saved successfully',
      totalEmissionKg,
      suggestions,
      data: newEntry
    });

  } catch (err) {
    console.error('❌ POST /footprint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ DELETE all (STATIC - must come before :id route)
router.delete('/clear/all', authenticateToken, async (req, res) => {
  try {
    await CarbonEntry.deleteMany({ email: req.user.email });
    res.json({ message: 'All entries cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Error clearing entries' });
  }
});

// ✅ GET all history (STATIC - must come before :id route)
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const entries = await CarbonEntry.find({ email: userEmail }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error('❌ GET /history error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ GET single entry (DYNAMIC)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await CarbonEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching entry' });
  }
});

// ✅ UPDATE entry (DYNAMIC)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = req.body;

    // Same calculation logic reused
    let foodEmission = 0;
    if (data.food) {
      const { type, amountKg } = data.food;
      const factor = 
        type === 'Animal based' ? 6.0 :
        type === 'Plant based' ? 1.5 :
        3.8;
      if (amountKg) foodEmission = factor * amountKg;
    }

    let transportTotal = 0;
    const transportWithEmissions = [];
    (data.transport || []).forEach(item => {
      const { mode, distanceKm } = item;
      const factor = {
        Car: 0.192,
        Bike: 0.016,
        Bus: 0.089,
        Metro: 0.041,
        Walking: 0.00,
        Train: 0.049,
        Flights: 0.254
      }[mode] || 0;

      const emissionKg = factor * distanceKm;
      transportTotal += emissionKg;
      transportWithEmissions.push({ mode, distanceKm, emissionKg });
    });

    let electricityTotal = 0;
    const electricityWithEmissions = [];
    (data.electricity || []).forEach(item => {
      const { source, consumptionKwh } = item;
      const factor = {
        Coal: 0.94,
        Solar: 0.05,
        Wind: 0.01,
        Hydro: 0.02,
        Mixed: 0.45
      }[source] || 0;

      const emissionKg = factor * consumptionKwh;
      electricityTotal += emissionKg;
      electricityWithEmissions.push({ source, consumptionKwh, emissionKg });
    });

    let wasteTotal = 0;
    const wasteWithEmissions = [];
    (data.waste || []).forEach(item => {
      const plasticKg = item.plasticKg || 0;
      const paperKg = item.paperKg || 0;
      const foodWasteKg = item.foodWasteKg || 0;

      const emissionKg =
        plasticKg * 5.8 +
        paperKg * 1.3 +
        foodWasteKg * 2.5;

      wasteTotal += emissionKg;
      wasteWithEmissions.push({ plasticKg, paperKg, foodWasteKg, emissionKg });
    });

    const totalEmissionKg = parseFloat(
      (foodEmission + transportTotal + electricityTotal + wasteTotal).toFixed(2)
    );

    let suggestions = '';
    if (totalEmissionKg <= 300) {
      suggestions =
        "🎉 Great job! Your monthly carbon footprint is well below average. Keep up your sustainable lifestyle, and consider going even further — like planting trees, reducing plastic use, or helping others calculate their footprint.";
    } else {
      if (foodEmission > 80) {
        suggestions += '🥩 Try reducing meat and dairy intake, and explore more plant-based meals. ';
      } else if (foodEmission > 40) {
        suggestions += '🥗 Great start! Reducing portion sizes or mixing with more plant-based meals can help. ';
      }

      if (transportTotal > 100) {
        suggestions += '🚗 Consider using public transport, carpooling, or biking for shorter trips. ';
      } else if (transportTotal > 50) {
        suggestions += '🚌 Good effort! Try reducing car use a bit more if possible. ';
      }

      if (electricityTotal > 100) {
        suggestions += '⚡ Switch to energy-efficient appliances or renewable energy if you can. ';
      } else if (electricityTotal > 50) {
        suggestions += '💡 Try reducing device standby time or using solar alternatives. ';
      }

      if (wasteTotal > 50) {
        suggestions += '🗑️ Reduce single-use plastics and improve recycling habits. ';
      } else if (wasteTotal > 30) {
        suggestions += '♻️ Consider composting and reusing more at home. ';
      }

      suggestions += '🌱 Every small step helps. Keep making eco-friendly choices and inspire others too!';
    }

    const updated = await CarbonEntry.findByIdAndUpdate(
      req.params.id,
      {
        food: data.food,
        transport: transportWithEmissions,
        electricity: electricityWithEmissions,
        waste: wasteWithEmissions,
        totalEmissionKg,
        suggestions
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Entry not found' });

    console.log("✅ Entry updated:", updated._id);
    res.json({ message: 'Entry updated', updated });

  } catch (err) {
    console.error('❌ PUT /footprint/:id error:', err);
    res.status(500).json({ error: 'Error updating entry' });
  }
});

// ✅ DELETE single entry (DYNAMIC)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await CarbonEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting entry' });
  }
});

console.log('🧪 footprintRoutes contents:', footprintRoutes);

module.exports = router;
