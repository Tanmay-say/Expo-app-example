// Environment Configuration for ElectroQuick
// This file reads from .env and provides typed access to environment variables

interface AppConfig {
  // AI Configuration
  GEMINI_API_KEY: string;
  GEMINI_MODEL_NAME: string;
  GEMINI_TEXT_MODEL: string;

  // App Info
  APP_NAME: string;
  APP_VERSION: string;
  COMPANY_NAME: string;
  COMPANY_EMAIL: string;
  COMPANY_PHONE: string;

  // Development
  DEBUG_MODE: boolean;
  LOG_LEVEL: string;
  ENABLE_CRASH_REPORTING: boolean;

  // Feature Flags
  ENABLE_AI_ASSISTANT: boolean;
  ENABLE_VOICE_COMMANDS: boolean;
  ENABLE_CAMERA_OCR: boolean;
  ENABLE_SPEECH_SYNTHESIS: boolean;
  ENABLE_OFFLINE_MODE: boolean;

  // Business Settings
  CURRENCY: string;
  CURRENCY_SYMBOL: string;
  TAX_RATE: number;
  DELIVERY_CHARGE: number;
  FREE_DELIVERY_THRESHOLD: number;

  // AI Settings
  AI_RESPONSE_MAX_LENGTH: number;
  AI_CHAT_HISTORY_LIMIT: number;
  AI_IMAGE_QUALITY: number;
  AI_SPEECH_RATE: number;
  AI_SPEECH_PITCH: number;
  AI_LANGUAGE: string;

  // Image Settings
  MAX_IMAGE_SIZE: number;
  IMAGE_COMPRESSION_QUALITY: number;
  SUPPORTED_IMAGE_FORMATS: string[];

  // Security
  SESSION_TIMEOUT: number;
  MAX_LOGIN_ATTEMPTS: number;
  RATE_LIMIT_REQUESTS: number;
  RATE_LIMIT_WINDOW: number;

  // Social Media
  WEBSITE_URL: string;
  FACEBOOK_URL: string;
  TWITTER_URL: string;
  INSTAGRAM_URL: string;
  LINKEDIN_URL: string;
}

// Helper function to parse boolean from env string
const parseBoolean = (value: string | undefined, defaultValue: boolean = false): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse number from env string
const parseNumber = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to parse array from env string
const parseArray = (value: string | undefined, defaultValue: string[] = []): string[] => {
  if (!value) return defaultValue;
  return value.split(',').map(item => item.trim());
};

// Get environment variable with fallback
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // In React Native, env vars are available at build time
  // For runtime env vars, you'd need a different approach
  
  // This is a simplified version - in production you might use:
  // - react-native-config
  // - expo-constants
  // - or build-time env injection
  
  const envVars: { [key: string]: string } = {
    // AI Configuration
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'your_actual_gemini_api_key_here',
    GEMINI_MODEL_NAME: process.env.GEMINI_MODEL_NAME || 'gemini-pro-vision',
    GEMINI_TEXT_MODEL: process.env.GEMINI_TEXT_MODEL || 'gemini-pro',

    // App Info
    APP_NAME: process.env.APP_NAME || 'ElectroQuick',
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
    COMPANY_NAME: process.env.COMPANY_NAME || 'ElectroQuick Solutions',
    COMPANY_EMAIL: process.env.COMPANY_EMAIL || 'support@electroquick.com',
    COMPANY_PHONE: process.env.COMPANY_PHONE || '+91-9876543210',

    // Development
    DEBUG_MODE: process.env.DEBUG_MODE || 'true',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ENABLE_CRASH_REPORTING: process.env.ENABLE_CRASH_REPORTING || 'false',

    // Feature Flags
    ENABLE_AI_ASSISTANT: process.env.ENABLE_AI_ASSISTANT || 'true',
    ENABLE_VOICE_COMMANDS: process.env.ENABLE_VOICE_COMMANDS || 'true',
    ENABLE_CAMERA_OCR: process.env.ENABLE_CAMERA_OCR || 'true',
    ENABLE_SPEECH_SYNTHESIS: process.env.ENABLE_SPEECH_SYNTHESIS || 'true',
    ENABLE_OFFLINE_MODE: process.env.ENABLE_OFFLINE_MODE || 'false',

    // Business
    CURRENCY: process.env.CURRENCY || 'INR',
    CURRENCY_SYMBOL: process.env.CURRENCY_SYMBOL || '₹',
    TAX_RATE: process.env.TAX_RATE || '18',
    DELIVERY_CHARGE: process.env.DELIVERY_CHARGE || '50',
    FREE_DELIVERY_THRESHOLD: process.env.FREE_DELIVERY_THRESHOLD || '1000',

    // AI Settings
    AI_RESPONSE_MAX_LENGTH: process.env.AI_RESPONSE_MAX_LENGTH || '1000',
    AI_CHAT_HISTORY_LIMIT: process.env.AI_CHAT_HISTORY_LIMIT || '10',
    AI_IMAGE_QUALITY: process.env.AI_IMAGE_QUALITY || '0.8',
    AI_SPEECH_RATE: process.env.AI_SPEECH_RATE || '0.9',
    AI_SPEECH_PITCH: process.env.AI_SPEECH_PITCH || '1.1',
    AI_LANGUAGE: process.env.AI_LANGUAGE || 'en-IN',

    // Image
    MAX_IMAGE_SIZE: process.env.MAX_IMAGE_SIZE || '1024',
    IMAGE_COMPRESSION_QUALITY: process.env.IMAGE_COMPRESSION_QUALITY || '0.8',
    SUPPORTED_IMAGE_FORMATS: process.env.SUPPORTED_IMAGE_FORMATS || 'jpg,jpeg,png,webp',

    // Security
    SESSION_TIMEOUT: process.env.SESSION_TIMEOUT || '3600',
    MAX_LOGIN_ATTEMPTS: process.env.MAX_LOGIN_ATTEMPTS || '5',
    RATE_LIMIT_REQUESTS: process.env.RATE_LIMIT_REQUESTS || '100',
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '60',

    // Social
    WEBSITE_URL: process.env.WEBSITE_URL || 'https://electroquick.com',
    FACEBOOK_URL: process.env.FACEBOOK_URL || 'https://facebook.com/electroquick',
    TWITTER_URL: process.env.TWITTER_URL || 'https://twitter.com/electroquick',
    INSTAGRAM_URL: process.env.INSTAGRAM_URL || 'https://instagram.com/electroquick',
    LINKEDIN_URL: process.env.LINKEDIN_URL || 'https://linkedin.com/company/electroquick',
  };

  return envVars[key] || defaultValue;
};

// Export typed configuration object
export const config: AppConfig = {
  // AI Configuration
  GEMINI_API_KEY: getEnvVar('GEMINI_API_KEY'),
  GEMINI_MODEL_NAME: getEnvVar('GEMINI_MODEL_NAME'),
  GEMINI_TEXT_MODEL: getEnvVar('GEMINI_TEXT_MODEL'),

  // App Info
  APP_NAME: getEnvVar('APP_NAME'),
  APP_VERSION: getEnvVar('APP_VERSION'),
  COMPANY_NAME: getEnvVar('COMPANY_NAME'),
  COMPANY_EMAIL: getEnvVar('COMPANY_EMAIL'),
  COMPANY_PHONE: getEnvVar('COMPANY_PHONE'),

  // Development
  DEBUG_MODE: parseBoolean(getEnvVar('DEBUG_MODE'), true),
  LOG_LEVEL: getEnvVar('LOG_LEVEL'),
  ENABLE_CRASH_REPORTING: parseBoolean(getEnvVar('ENABLE_CRASH_REPORTING'), false),

  // Feature Flags
  ENABLE_AI_ASSISTANT: parseBoolean(getEnvVar('ENABLE_AI_ASSISTANT'), true),
  ENABLE_VOICE_COMMANDS: parseBoolean(getEnvVar('ENABLE_VOICE_COMMANDS'), true),
  ENABLE_CAMERA_OCR: parseBoolean(getEnvVar('ENABLE_CAMERA_OCR'), true),
  ENABLE_SPEECH_SYNTHESIS: parseBoolean(getEnvVar('ENABLE_SPEECH_SYNTHESIS'), true),
  ENABLE_OFFLINE_MODE: parseBoolean(getEnvVar('ENABLE_OFFLINE_MODE'), false),

  // Business Settings
  CURRENCY: getEnvVar('CURRENCY'),
  CURRENCY_SYMBOL: getEnvVar('CURRENCY_SYMBOL'),
  TAX_RATE: parseNumber(getEnvVar('TAX_RATE'), 18),
  DELIVERY_CHARGE: parseNumber(getEnvVar('DELIVERY_CHARGE'), 50),
  FREE_DELIVERY_THRESHOLD: parseNumber(getEnvVar('FREE_DELIVERY_THRESHOLD'), 1000),

  // AI Settings
  AI_RESPONSE_MAX_LENGTH: parseNumber(getEnvVar('AI_RESPONSE_MAX_LENGTH'), 1000),
  AI_CHAT_HISTORY_LIMIT: parseNumber(getEnvVar('AI_CHAT_HISTORY_LIMIT'), 10),
  AI_IMAGE_QUALITY: parseNumber(getEnvVar('AI_IMAGE_QUALITY'), 0.8),
  AI_SPEECH_RATE: parseNumber(getEnvVar('AI_SPEECH_RATE'), 0.9),
  AI_SPEECH_PITCH: parseNumber(getEnvVar('AI_SPEECH_PITCH'), 1.1),
  AI_LANGUAGE: getEnvVar('AI_LANGUAGE'),

  // Image Settings
  MAX_IMAGE_SIZE: parseNumber(getEnvVar('MAX_IMAGE_SIZE'), 1024),
  IMAGE_COMPRESSION_QUALITY: parseNumber(getEnvVar('IMAGE_COMPRESSION_QUALITY'), 0.8),
  SUPPORTED_IMAGE_FORMATS: parseArray(getEnvVar('SUPPORTED_IMAGE_FORMATS')),

  // Security
  SESSION_TIMEOUT: parseNumber(getEnvVar('SESSION_TIMEOUT'), 3600),
  MAX_LOGIN_ATTEMPTS: parseNumber(getEnvVar('MAX_LOGIN_ATTEMPTS'), 5),
  RATE_LIMIT_REQUESTS: parseNumber(getEnvVar('RATE_LIMIT_REQUESTS'), 100),
  RATE_LIMIT_WINDOW: parseNumber(getEnvVar('RATE_LIMIT_WINDOW'), 60),

  // Social Media
  WEBSITE_URL: getEnvVar('WEBSITE_URL'),
  FACEBOOK_URL: getEnvVar('FACEBOOK_URL'),
  TWITTER_URL: getEnvVar('TWITTER_URL'),
  INSTAGRAM_URL: getEnvVar('INSTAGRAM_URL'),
  LINKEDIN_URL: getEnvVar('LINKEDIN_URL'),
};

// Validation function
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY === 'your_actual_gemini_api_key_here') {
    errors.push('GEMINI_API_KEY is required for AI features');
  }

  if (!config.APP_NAME) {
    errors.push('APP_NAME is required');
  }

  if (config.TAX_RATE < 0 || config.TAX_RATE > 100) {
    errors.push('TAX_RATE must be between 0 and 100');
  }

  if (config.AI_IMAGE_QUALITY < 0.1 || config.AI_IMAGE_QUALITY > 1.0) {
    errors.push('AI_IMAGE_QUALITY must be between 0.1 and 1.0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Debug helper
export const logConfig = () => {
  if (config.DEBUG_MODE) {
    console.log('🔧 ElectroQuick Configuration:', {
      APP_NAME: config.APP_NAME,
      APP_VERSION: config.APP_VERSION,
      GEMINI_API_CONFIGURED: config.GEMINI_API_KEY !== 'your_actual_gemini_api_key_here',
      FEATURES_ENABLED: {
        AI_ASSISTANT: config.ENABLE_AI_ASSISTANT,
        VOICE_COMMANDS: config.ENABLE_VOICE_COMMANDS,
        CAMERA_OCR: config.ENABLE_CAMERA_OCR,
        SPEECH_SYNTHESIS: config.ENABLE_SPEECH_SYNTHESIS,
      },
      BUSINESS: {
        CURRENCY: config.CURRENCY_SYMBOL,
        TAX_RATE: config.TAX_RATE + '%',
        DELIVERY_CHARGE: config.CURRENCY_SYMBOL + config.DELIVERY_CHARGE,
      }
    });
  }
};

export default config;