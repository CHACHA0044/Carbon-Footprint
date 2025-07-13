const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

//Express app
const app = express();
const authRoutes = require('./routes/auth');
const footprintRoutes = require('./routes/footprint');

// allowed CORS origins
const allowedOrigins = ['https://carbon-footprint-1yac.onrender.com'];
console.log('📌 process.env.DEBUG_URL after delete:', process.env.DEBUG_URL);

//setup CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

//api routes
app.use('/api/footprint', footprintRoutes);
app.use('/api/auth', authRoutes);

//Test root route
app.get('/api', (req, res) => {
  res.send('🌍 Carbon Footprint API is running!');
});


//mongo connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'carbon-tracker',
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
