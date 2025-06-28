
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Allow your frontend's Render domain
const allowedOrigins = ['https://carbon-footprint-1yac.onrender.com'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Explicitly handle preflight
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const footprintRoutes = require('./routes/footprint');

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

app.get('/', (req, res) => {
  res.send('Carbon Footprint API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
