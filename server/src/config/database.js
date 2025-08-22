const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variables for configuration
 */
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-life-manager';
    
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('🎉 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * Useful for testing or graceful shutdown
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed successfully');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
    throw error;
  }
};

/**
 * Get database connection status
 * @returns {Object} Connection status information
 */
const getDBStatus = () => {
  const connection = mongoose.connection;
  return {
    readyState: connection.readyState,
    host: connection.host,
    port: connection.port,
    name: connection.name,
    isConnected: connection.readyState === 1,
    readyStateText: getReadyStateText(connection.readyState),
  };
};

/**
 * Convert MongoDB ready state to human-readable text
 * @param {number} readyState - MongoDB connection ready state
 * @returns {string} Human-readable connection state
 */
const getReadyStateText = (readyState) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[readyState] || 'unknown';
};

/**
 * Check if database is ready for operations
 * @returns {boolean} True if database is ready
 */
const isDBReady = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database statistics
 * @returns {Promise<Object>} Database statistics
 */
const getDBStats = async () => {
  try {
    if (!isDBReady()) {
      throw new Error('Database not connected');
    }

    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      avgObjSize: stats.avgObjSize,
      objects: stats.objects,
    };
  } catch (error) {
    console.error('Error getting database stats:', error.message);
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  getDBStatus,
  isDBReady,
  getDBStats,
}; 