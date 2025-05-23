/**
 * CORS configuration for both HTTP and WebSocket connections
 */

const corsOptions = {
  // Allow requests from these origins
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  // Allow credentials (cookies, authorization headers, etc)
  credentials: true,
  
  // Allow specific methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // Allow specific headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  
  // Expose these headers to the client
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  
  // Pre-flight requests are cached for 1 hour
  maxAge: 3600,
  
  // Additional WebSocket specific settings
  handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': 3600
    });
    res.end();
  }
};

module.exports = corsOptions;
