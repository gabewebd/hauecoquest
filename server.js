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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quests', require('./routes/quests'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/daily', require('./routes/daily'));
app.use('/api/badges', require('./routes/badges'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HAU Eco-Quest API is running' });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));