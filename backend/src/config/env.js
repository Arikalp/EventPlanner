const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '../../.env') });

class EnvironmentConfig {
  static get serverPort() {
    return parseInt(process.env.PORT) || 5000;
  }

  static get aiConfiguration() {
    return {
      googleApiKey: process.env.GOOGLE_AI_API_KEY,
      huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
      modelName: process.env.HUGGINGFACE_MODEL
    };
  }

  static get databaseUrl() {
    return process.env.MONGO_URI || 'mongodb://localhost:27017/event-planner-db';
  }

  static get locationService() {
    return {
      foursquareKey: process.env.FOURSQUARE_API_KEY
    };
  }

  static get emailConfiguration() {
    return {
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID
    };
  }

  static get videoCallConfig() {
    return {
      agoraAppId: process.env.AGORA_APP_ID
    };
  }
}

// Export individual properties for backward compatibility
module.exports = {
  PORT: EnvironmentConfig.serverPort,
  GOOGLE_AI_API_KEY: EnvironmentConfig.aiConfiguration.googleApiKey,
  HUGGINGFACE_API_KEY: EnvironmentConfig.aiConfiguration.huggingfaceApiKey,
  HUGGINGFACE_MODEL: EnvironmentConfig.aiConfiguration.modelName,
  MONGO_URI: EnvironmentConfig.databaseUrl,
  FOURSQUARE_API_KEY: EnvironmentConfig.locationService.foursquareKey,
  EMAILJS_PUBLIC_KEY: EnvironmentConfig.emailConfiguration.publicKey,
  EMAILJS_SERVICE_ID: EnvironmentConfig.emailConfiguration.serviceId,
  EMAILJS_TEMPLATE_ID: EnvironmentConfig.emailConfiguration.templateId,
  AGORA_APP_ID: EnvironmentConfig.videoCallConfig.agoraAppId,
  EnvironmentConfig
};

