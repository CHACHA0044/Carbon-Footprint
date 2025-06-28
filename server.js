const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ✅ Create Express app
const app = express();
const authRoutes = require('./routes/auth');
const footprintRoutes = require('./routes/footprint');

// ✅ Define allowed CORS origins
const allowedOrigins = ['https://carbon-footprint-1yac.onrender.com'];
console.log('📌 process.env.DEBUG_URL after delete:', process.env.DEBUG_URL);

// ✅ Setup CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Body parser middleware
app.use(express.json());

// ✅ Register API routes
app.use('/api/footprint', footprintRoutes);
app.use('/api/auth', authRoutes);

// ✅ Test root route
app.get('/api', (req, res) => {
  res.send('🌍 Carbon Footprint API is running!');
});

// ✅ Serve React frontend (after all /api routes)
const clientBuildPath = path.join(__dirname, '../carbon-footprint-client/build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'carbon-tracker',
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ✅ Start the server (after everything is setup)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
