/**
 * Database Connection Manager
 * Handles MongoDB connection with retry logic and monitoring
 */

const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

class DatabaseManager {
  constructor() {
    this.connectionString = MONGO_URI;
    this.connectionOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    };
    this.setupEventListeners();
  }

  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('🔗 Database connection established successfully');
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ Database connection error:', error.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Database connection lost');
    });
  }

  async establishConnection() {
    try {
      if (!this.connectionString) {
        throw new Error('Database connection string not provided');
      }

      await mongoose.connect(this.connectionString, this.connectionOptions);
      return true;
    } catch (error) {
      console.error('💥 Failed to establish database connection:', error.message);
      throw error;
    }
  }

  async closeConnection() {
    try {
      await mongoose.connection.close();
      console.log('🔒 Database connection closed gracefully');
    } catch (error) {
      console.error('Error closing database connection:', error.message);
    }
  }

  getConnectionStatus() {
    return {
      state: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }
}

const dbManager = new DatabaseManager();

// Export both class and legacy function for compatibility
module.exports = {
  connectDB: () => dbManager.establishConnection(),
  DatabaseManager,
  dbManager
};
