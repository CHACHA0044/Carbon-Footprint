const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// ✅ Load routes


// ✅ Debug logs before registering routes
console.log('🔄 Loading routes...');
console.log('🔄 authRoutes loaded:', typeof authRoutes === 'function');
console.log('🔄 footprintRoutes loaded:', typeof footprintRoutes === 'function');

// ✅ Register routes
app.use('/api/footprint', require('./routes/footprint'));
app.use('/api/auth', require('./routes/auth'));


// ✅ Test root route
app.get('/', (req, res) => {
  res.send('🌍 Carbon Footprint API is running!');
});

// ✅ Log environment variables (for debug only – remove in production)
console.log('🌐 Environment Test Variable:', process.env.TEST || 'Not set');
console.log('🌐 MONGO_URI:', process.env.MONGO_URI ? 'Loaded' : 'Missing');
console.log('🌐 PORT:', process.env.PORT);

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

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
