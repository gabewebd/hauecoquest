//Josh Andrei Aguiluz
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  // Only log non-health check requests
  if (req.path !== '/api/health' && req.path !== '/api/auth/me') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', req.body);
    }
  }
  next();
});

// Ensure client/img directory structure exists
const fs = require('fs');
const imgDir = path.join(__dirname, 'client', 'img');
const postsDir = path.join(imgDir, 'posts');
const questsDir = path.join(imgDir, 'quests');
const challengesDir = path.join(imgDir, 'challenges');

// Create directories if they don't exist
[imgDir, postsDir, questsDir, challengesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Serve uploaded files statically from client/img directory
app.use('/img', express.static(imgDir, {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  }
}));

// Define Routes with error handling
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/quests', require('./routes/quests'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/posts', require('./routes/posts'));
  app.use('/api/daily', require('./routes/daily'));
  app.use('/api/badges', require('./routes/badges'));
  app.use('/api/challenges', require('./routes/challenges'));
  app.use('/api/dashboard', require('./routes/dashboard'));
  app.use('/api/notifications', require('./routes/notifications').router);
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error);
}

// Health check route
app.get('/api/health', (req, res) => {
  const imgExists = fs.existsSync(imgDir);
  const postsFiles = fs.existsSync(postsDir) ? fs.readdirSync(postsDir).length : 0;
  const questsFiles = fs.existsSync(questsDir) ? fs.readdirSync(questsDir).length : 0;
  const challengesFiles = fs.existsSync(challengesDir) ? fs.readdirSync(challengesDir).length : 0;
  
  res.json({ 
    status: 'ok', 
    message: 'HAU Eco-Quest API is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    img: {
      directory: imgDir,
      exists: imgExists,
      posts: { directory: postsDir, fileCount: postsFiles },
      quests: { directory: questsDir, fileCount: questsFiles },
      challenges: { directory: challengesDir, fileCount: challengesFiles }
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    msg: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    msg: 'Route not found',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
});