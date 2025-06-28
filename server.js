require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Load routes
const authRoutes = require('./routes/auth');
const footprintRoutes = require('./routes/footprint');

// Middleware
app.use(cors());
app.use(express.json());

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/footprint', footprintRoutes);

// Debug logs
console.log('TEST:', process.env.TEST);
console.log('Loaded MONGO_URI:', process.env.MONGO_URI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'carbon-tracker'
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Root route
app.get('/', (req, res) => {
  res.send('Carbon Footprint API is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
