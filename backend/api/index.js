// Vercel serverless function entry point
require('dotenv').config();

// Import the Express app (using CommonJS syntax)
const app = require('../app.js');

// Export the Express app as a serverless function
// Vercel will handle the HTTP server internally
module.exports = app;
