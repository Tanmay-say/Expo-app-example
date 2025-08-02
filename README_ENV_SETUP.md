# 🔐 Environment Variables Setup for ElectroQuick

## 🚀 Quick Setup

### 1. Create Environment File
```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

### 2. Add Your API Keys

Open `.env` and replace these values:

```bash
# Get your Gemini API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyD7bX9fZYX8rN2mH1cK4lP6qR3tU9vW2xY

# Your business details
COMPANY_NAME=Your Company Name
COMPANY_EMAIL=your-email@company.com
COMPANY_PHONE=+91-9876543210
```

## 📋 Available Variables

### 🤖 AI Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `GEMINI_MODEL_NAME` | AI model for vision tasks | gemini-pro-vision |
| `GEMINI_TEXT_MODEL` | AI model for text tasks | gemini-pro |

### 🏢 Business Settings
| Variable | Description | Default |
|----------|-------------|---------|
| `CURRENCY` | App currency code | INR |
| `CURRENCY_SYMBOL` | Currency symbol | ₹ |
| `TAX_RATE` | Tax percentage | 18 |
| `DELIVERY_CHARGE` | Delivery fee | 50 |
| `FREE_DELIVERY_THRESHOLD` | Free delivery above | 1000 |

### 🎛️ Feature Flags
| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_AI_ASSISTANT` | Enable AI chat | true |
| `ENABLE_VOICE_COMMANDS` | Enable voice input | true |
| `ENABLE_CAMERA_OCR` | Enable image scanning | true |
| `ENABLE_SPEECH_SYNTHESIS` | Enable voice output | true |

### 🔧 AI Settings
| Variable | Description | Default |
|----------|-------------|---------|
| `AI_RESPONSE_MAX_LENGTH` | Max AI response chars | 1000 |
| `AI_CHAT_HISTORY_LIMIT` | Chat history messages | 10 |
| `AI_IMAGE_QUALITY` | Image compression (0.1-1.0) | 0.8 |
| `AI_SPEECH_RATE` | Speech speed (0.1-2.0) | 0.9 |
| `AI_LANGUAGE` | Speech language | en-IN |

## 💻 Usage in Code

### Import Configuration
```typescript
import { config } from './src/config/env';

// Use typed configuration
console.log(config.APP_NAME); // "ElectroQuick"
console.log(config.CURRENCY_SYMBOL); // "₹"
console.log(config.ENABLE_AI_ASSISTANT); // true
```

### Feature Flags Example
```typescript
import { config } from './src/config/env';

// Conditional features
if (config.ENABLE_AI_ASSISTANT) {
  // Show AI assistant
}

if (config.ENABLE_CAMERA_OCR) {
  // Enable camera features
}
```

### Business Logic
```typescript
import { config } from './src/config/env';

// Pricing calculations
const subtotal = 1000;
const tax = subtotal * (config.TAX_RATE / 100);
const delivery = subtotal >= config.FREE_DELIVERY_THRESHOLD ? 0 : config.DELIVERY_CHARGE;
const total = subtotal + tax + delivery;

// Display currency
const displayPrice = `${config.CURRENCY_SYMBOL}${total.toFixed(2)}`;
```

## 🔒 Security Best Practices

### Environment Files
```bash
# ✅ Keep in version control (template)
.env.example

# ❌ Never commit (contains secrets)
.env
.env.production
.env.staging
```

### API Key Security
```typescript
// ✅ Good: Use environment variables
const apiKey = config.GEMINI_API_KEY;

// ❌ Bad: Hardcoded keys
const apiKey = "AIzaSyD7bX9fZYX8rN2mH1cK4lP6qR3tU9vW2xY";
```

## 🎯 Development vs Production

### Development (.env)
```bash
DEBUG_MODE=true
LOG_LEVEL=debug
ENABLE_CRASH_REPORTING=false
GEMINI_API_KEY=your_dev_api_key
```

### Production (.env.production)
```bash
DEBUG_MODE=false
LOG_LEVEL=error
ENABLE_CRASH_REPORTING=true
GEMINI_API_KEY=your_prod_api_key
```

## 🚨 Troubleshooting

### Common Issues

**1. API Key Not Working**
```bash
# Check if key is set
console.log('API Key:', config.GEMINI_API_KEY);

# Validate configuration
import { validateConfig } from './src/config/env';
const { isValid, errors } = validateConfig();
console.log('Config valid:', isValid, errors);
```

**2. Missing Environment File**
```bash
# Error: Cannot find .env
# Solution: Copy from example
cp .env.example .env
```

**3. Invalid Values**
```bash
# Error: TAX_RATE must be between 0 and 100
# Solution: Check numeric values in .env
TAX_RATE=18  # ✅ Correct
TAX_RATE=180 # ❌ Invalid
```

## 🔄 Runtime Configuration

### Check Current Config
```typescript
import { config, logConfig, validateConfig } from './src/config/env';

// Log all settings (development only)
logConfig();

// Validate configuration
const { isValid, errors } = validateConfig();
if (!isValid) {
  console.error('Configuration errors:', errors);
}
```

### Feature Detection
```typescript
import { config } from './src/config/env';

// Check if AI is properly configured
const isAIReady = config.ENABLE_AI_ASSISTANT && 
                  config.GEMINI_API_KEY !== 'your_actual_gemini_api_key_here';

if (isAIReady) {
  // Initialize AI features
} else {
  // Show manual mode
}
```

## 📱 Expo Integration

### Using with Expo Constants
```typescript
import Constants from 'expo-constants';

// Access env vars through Expo
const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY;
```

### Build-time Variables
```json
// app.json
{
  "expo": {
    "extra": {
      "GEMINI_API_KEY": "@GEMINI_API_KEY@"
    }
  }
}
```

## 🎉 You're Ready!

Your ElectroQuick app now has:
- ✅ Secure environment variable management
- ✅ Type-safe configuration access
- ✅ Feature flag controls
- ✅ Business setting customization
- ✅ Development/production separation

**Happy coding with secure configuration! 🔐⚡**