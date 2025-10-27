const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const initDatabase = require('./config/initDB');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
initDatabase();

// Routes
app.use('/api/issues', require('./routes/issues'));

// Add after other routes
app.use('/api/auth', require('./routes/auth'));

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Improve My City Backend is running!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}`);
  console.log(`📍 Issues API: http://localhost:${PORT}/api/issues`);
});
