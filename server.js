//Josh Andrei Aguiluz
require('dotenv').config(); // This loads the variables from .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your React app to talk to this backend
app.use(express.json()); // Allows us to accept JSON data in the request body

// Define Routes
app.use('/api/auth', require('./routes/auth'));
// You can add more routes here later, e.g., app.use('/api/quests', require('./routes/quests'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));