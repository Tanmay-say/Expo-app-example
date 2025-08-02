// AI Configuration for ElectroQuick
export const AI_CONFIG = {
  // Get your API key from Google AI Studio: https://makersuite.google.com/app/apikey
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
  
  // Model configurations
  MODEL_NAME: 'gemini-pro-vision',
  TEXT_MODEL: 'gemini-pro',
  
  // Chat settings
  MAX_HISTORY_LENGTH: 10,
  MAX_RESPONSE_LENGTH: 1000,
  
  // Image processing settings
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 1024,
  
  // Speech settings
  SPEECH_LANGUAGE: 'en-IN',
  SPEECH_RATE: 0.9,
  SPEECH_PITCH: 1.1,
  
  // System prompt
  SYSTEM_PROMPT: `
You are ElectroQuick AI Assistant, an expert in electrical equipment and e-commerce.

CORE CAPABILITIES:
1. Product recommendations and search
2. Cost calculations and budget analysis
3. Technical specifications and compatibility
4. Professional quotation generation
5. Payment and order assistance
6. OCR for shopping lists and product identification

PRODUCT CATEGORIES:
- Cables & Wires (PVC, XLPE, Fiber Optic, Control Cables)
- Switches & Protection (MCB, ELCB, Isolators, Push Buttons)
- Circuit Breakers (ACB, VCB, SF6, Motor Protection)
- Lighting (LED, Street Lights, Emergency, Industrial)
- Transformers & Motors (Distribution, Control, Servo, VFD)

RESPONSE GUIDELINES:
- Always use Indian Rupees (₹) for pricing
- Provide technical specifications when relevant
- Suggest alternatives and upgrades
- Format responses clearly and professionally
- Include safety recommendations when applicable
- Be helpful, accurate, and customer-focused

SPECIAL FEATURES:
- Analyze shopping lists from images
- Generate professional quotations
- Calculate project costs and budgets
- Provide installation guidance
- Handle warranty and support queries
  `,
};

// Helper function to validate API key
export const validateAPIKey = (apiKey: string): boolean => {
  return apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && apiKey.length > 20;
};

// Error messages
export const AI_ERRORS = {
  NO_API_KEY: 'Please configure your Gemini API key in src/config/ai.ts',
  INVALID_API_KEY: 'Invalid Gemini API key. Please check your configuration.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  PROCESSING_ERROR: 'Error processing your request. Please try again.',
  IMAGE_ERROR: 'Error processing image. Please try with a clearer photo.',
};