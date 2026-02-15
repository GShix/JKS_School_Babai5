// Vercel serverless function entry point
import dotenv from 'dotenv';

// Load environment variables first (though Vercel will override these)
dotenv.config();

// Import the Express app
import app from '../src/app.js';

// Export the Express app as a serverless function
// Vercel will handle the HTTP server internally
export default app;
