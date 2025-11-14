/**
 * Event Management System - Main Application Entry Point
 * Handles server initialization and routing configuration
 */

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { PORT } = require('./config/env');

// Import route handlers
const conversationHandler = require('./routes/chat.routes');
const eventManagement = require('./routes/events.routes');
const attendeeResponses = require('./routes/rsvp.routes');
const notificationSystem = require('./routes/reminder.routes');

class EventPlannerServer {
  constructor() {
    this.application = express();
    this.serverPort = PORT;
    this.initializeMiddleware();
    this.setupRoutes();
    this.handleErrors();
  }

  initializeMiddleware() {
    // Enable cross-origin requests
    this.application.use(cors({
      origin: process.env.NODE_ENV === 'production' ? false : true,
      credentials: true
    }));
    
    // Parse incoming JSON requests
    this.application.use(express.json({ limit: '10mb' }));
    this.application.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // System status endpoint
    this.application.get('/health', this.healthCheck);
    
    // API endpoint configuration
    this.application.use('/api/conversations', conversationHandler);
    this.application.use('/api/event-management', eventManagement);
    this.application.use('/api/attendee-responses', attendeeResponses);
    this.application.use('/api/notifications', notificationSystem);
  }

  healthCheck(req, res) {
    res.status(200).json({
      service: 'Event Planning Assistant',
      status: 'operational',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }

  handleErrors() {
    // Handle undefined routes
    this.application.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found`,
        availableEndpoints: ['/health', '/api/conversations', '/api/event-management']
      });
    });

    // Global error handler
    this.application.use((error, req, res, next) => {
      console.error('Application Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred'
      });
    });
  }

  async initialize() {
    try {
      // Establish database connection
      await connectDB();
      console.log('✅ Database connection established');
      
      // Start HTTP server
      this.application.listen(this.serverPort, () => {
        console.log(`🚀 Event Planner API running on port ${this.serverPort}`);
        console.log(`📍 Health check: http://localhost:${this.serverPort}/health`);
      });
    } catch (error) {
      console.error('❌ Server initialization failed:', error.message);
      process.exit(1);
    }
  }
}

// Bootstrap the application
const server = new EventPlannerServer();
server.initialize().catch(console.error);
