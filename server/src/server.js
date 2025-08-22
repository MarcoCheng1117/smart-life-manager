/**
 * Smart Life Manager Server
 * Secure entry point with comprehensive error handling
 */

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/database');

// Environment validation
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Validate JWT secret strength
if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters long for security');
  process.exit(1);
}

// Validate MongoDB URI
if (!process.env.MONGODB_URI.includes('mongodb://') && !process.env.MONGODB_URI.includes('mongodb+srv://')) {
  console.error('❌ Invalid MONGODB_URI format');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

/**
 * Start server function
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('🚀 Smart Life Manager Server Started');
      console.log('📊 Environment:', process.env.NODE_ENV);
      console.log('🔌 Port:', PORT);
      console.log('🌐 URL:', `http://localhost:${PORT}`);
      console.log('📝 API Documentation:', `http://localhost:${PORT}/api`);
      console.log('💚 Health Check:', `http://localhost:${PORT}/health`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development Mode: Hot reloading enabled');
        console.log('📚 Swagger Docs:', `http://localhost:${PORT}/api-docs`);
      }
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
      
      server.close(async () => {
        console.log('🔌 HTTP server closed');
        
        try {
          // Close database connection
          const mongoose = require('mongoose');
          await mongoose.connection.close();
          console.log('📊 Database connection closed');
          
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      console.error('Stack trace:', error.stack);
      
      // Log to file in production
      if (process.env.NODE_ENV === 'production') {
        const fs = require('fs');
        const path = require('path');
        
        const logDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logFile = path.join(logDir, 'uncaught-exceptions.log');
        const logEntry = `${new Date().toISOString()} - Uncaught Exception: ${error.message}\n${error.stack}\n\n`;
        
        fs.appendFileSync(logFile, logEntry);
      }
      
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Promise Rejection at:', promise);
      console.error('Reason:', reason);
      
      // Log to file in production
      if (process.env.NODE_ENV === 'production') {
        const fs = require('fs');
        const path = require('path');
        
        const logDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        const logFile = path.join(logDir, 'unhandled-rejections.log');
        const logEntry = `${new Date().toISOString()} - Unhandled Rejection: ${reason}\nPromise: ${promise}\n\n`;
        
        fs.appendFileSync(logFile, logEntry);
      }
      
      process.exit(1);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          console.error(`❌ Port ${PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`❌ Port ${PORT} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Security monitoring
    if (process.env.NODE_ENV === 'production') {
      // Monitor for suspicious activity
      let requestCount = 0;
      let lastReset = Date.now();
      
      server.on('connection', (socket) => {
        requestCount++;
        
        // Reset counter every hour
        if (Date.now() - lastReset > 3600000) {
          requestCount = 0;
          lastReset = Date.now();
        }
        
        // Alert if too many connections
        if (requestCount > 1000) {
          console.warn('⚠️ High connection count detected:', requestCount);
        }
      });
    }

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Initialize server
 */
startServer();

module.exports = app; 