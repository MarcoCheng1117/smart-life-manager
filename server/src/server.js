/**
 * Smart Life Manager Server
 * Main entry point for the Express server
 */

const app = require('./app');
const { initializeStorage } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Initialize storage and start server
const startServer = async () => {
  try {
    // Initialize in-memory storage
    initializeStorage();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📦 Using in-memory storage (no database required)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 