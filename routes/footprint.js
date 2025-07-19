const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authmiddleware');
const CarbonEntry = require('../models/CarbonEntry');
const calculateEmissions = require('../utils/calculateEmissions');

//  POST: Create entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = req.body;

    // calculate emissions (same as before)
    const { totalEmissionKg, suggestions, capped, foodWithEmission, transportWithEmissions, electricityWithEmissions, wasteWithEmissions } = calculateEmissions(data);
    const email = req.user.email;
    const updatedDoc = await CarbonEntry.findOneAndUpdate(
      { email },
      {
        $push: {
          entries: {
            food: foodWithEmission,
            transport: transportWithEmissions,
            electricity: electricityWithEmissions,
            waste: wasteWithEmissions,
            totalEmissionKg,
            suggestions,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: 'Entry added successfully',
      totalEmissionKg,
      suggestions,
      capped,
      data: updatedDoc
    });
  } catch (err) {
    console.error('❌ POST /footprint error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE all 
router.delete('/clear/all', authenticateToken, async (req, res) => {
  try {
    const updatedDoc = await CarbonEntry.findOneAndUpdate(
      { email: req.user.email },
      { $set: { entries: [] } },
      { new: true }
    );
    res.json({ message: 'All entries cleared', data: updatedDoc });
  } catch (err) {
    res.status(500).json({ error: 'Error clearing entries' });
  }
});


// GET all history 
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const doc = await CarbonEntry.findOne({ email: req.user.email });
    if (!doc || doc.entries.length === 0) return res.status(200).json([]);
    res.status(200).json(doc.entries.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    console.error('❌ GET /history error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET single entry 
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const doc = await CarbonEntry.findOne({ email: req.user.email, "entries._id": req.params.id }, { "entries.$": 1 });
    if (!doc || doc.entries.length === 0) return res.status(404).json({ error: 'Entry not found' });
    res.json(doc.entries[0]);

  } catch (err) {
    res.status(500).json({ error: 'Error fetching entry' });
  }
});

//  UPDATE entry 
router.put('/:entryId', authenticateToken, async (req, res) => {
  try {
    const { entryId } = req.params;
    const email = req.user.email;
    const data = req.body;

    const { totalEmissionKg, suggestions, capped, foodWithEmission, transportWithEmissions, electricityWithEmissions, wasteWithEmissions } = calculateEmissions(data);
    const updatedDoc = await CarbonEntry.findOneAndUpdate(
      { email, "entries._id": entryId },
      {
        $set: {
          "entries.$.food": foodWithEmission,
          "entries.$.transport": transportWithEmissions,
          "entries.$.electricity": electricityWithEmissions,
          "entries.$.waste": wasteWithEmissions,
          "entries.$.totalEmissionKg": totalEmissionKg,
          "entries.$.suggestions": suggestions,
          "entries.$.updatedAt": new Date()
        }
      },
      { new: true }
    );

    if (!updatedDoc) return res.status(404).json({ error: 'Entry not found' });

    res.json({ message: 'Entry updated successfully', totalEmissionKg, suggestions, capped, data: updatedDoc });
  } catch (err) {
    console.error('❌ PUT /footprint/:entryId error:', err);
    res.status(500).json({ error: 'Error updating entry' });
  }
});


//DELETE single entry 
router.delete('/:entryId', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { entryId } = req.params;

    const updatedDoc = await CarbonEntry.findOneAndUpdate(
      { email },
      { $pull: { entries: { _id: entryId } } },
      { new: true }
    );

    res.json({ message: 'Entry deleted', data: updatedDoc });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting entry' });
  }
});


module.exports = router;
