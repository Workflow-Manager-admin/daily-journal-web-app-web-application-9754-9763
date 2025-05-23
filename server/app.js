const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors.config');

// Create Express app
const app = express();

// Apply CORS middleware with our configuration
app.use(cors(corsOptions));

// Additional WebSocket CORS headers middleware
app.use((req, res, next) => {
  // Ensure WebSocket upgrade requests are handled properly
  if (req.headers['upgrade'] === 'websocket') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Add your routes here

module.exports = app;
