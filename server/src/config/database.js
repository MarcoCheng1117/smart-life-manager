/**
 * In-Memory Storage Configuration
 * Replaces MongoDB with local cookie-based storage
 */

// In-memory storage for development/testing
const memoryStorage = {
  users: new Map(),
  tasks: new Map(),
  goals: new Map(),
  health: new Map(),
  finance: new Map(),
  notes: new Map()
};

/**
 * Initialize storage system
 */
const initializeStorage = () => {
  console.log('📦 Initializing in-memory storage system');
  
  // Add some sample data for testing
  const sampleUser = {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString()
  };
  
  memoryStorage.users.set('1', sampleUser);
  
  console.log('✅ In-memory storage initialized');
  return true;
};

/**
 * Get storage status
 */
const getStorageStatus = () => {
  return {
    type: 'in-memory',
    status: 'connected',
    collections: Object.keys(memoryStorage),
    userCount: memoryStorage.users.size,
    taskCount: memoryStorage.tasks.size,
    goalCount: memoryStorage.goals.size,
    healthCount: memoryStorage.health.size,
    financeCount: memoryStorage.finance.size,
    noteCount: memoryStorage.notes.size
  };
};

/**
 * Check if storage is ready
 */
const isStorageReady = () => {
  return true; // Always ready for in-memory storage
};

/**
 * Get storage statistics
 */
const getStorageStats = () => {
  return {
    totalUsers: memoryStorage.users.size,
    totalTasks: memoryStorage.tasks.size,
    totalGoals: memoryStorage.goals.size,
    totalHealth: memoryStorage.health.size,
    totalFinance: memoryStorage.finance.size,
    totalNotes: memoryStorage.notes.size,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  };
};

/**
 * Clear all data (for testing)
 */
const clearStorage = () => {
  memoryStorage.users.clear();
  memoryStorage.tasks.clear();
  memoryStorage.goals.clear();
  memoryStorage.health.clear();
  memoryStorage.finance.clear();
  memoryStorage.notes.clear();
  console.log('🗑️ Storage cleared');
};

/**
 * Export storage instance for use in other modules
 */
const getStorage = () => memoryStorage;

module.exports = {
  initializeStorage,
  getStorageStatus,
  isStorageReady,
  getStorageStats,
  clearStorage,
  getStorage
}; 