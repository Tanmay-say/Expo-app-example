# 🤖 AI Assistant Setup Guide for ElectroQuick

## 🚀 Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the API Key

Open `src/config/ai.ts` and replace:
```typescript
GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
```

With your actual API key:
```typescript
GEMINI_API_KEY: 'AIzaSyD7bX9...',  // Your real API key
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Request Permissions

The app will automatically request camera and media library permissions when needed.

## 🎯 AI Features

### 📱 Smart Chat Interface
- Natural language product queries
- Technical specifications assistance
- Price comparisons and recommendations
- Payment and order support

### 📸 Image Analysis (OCR)
- Scan handwritten shopping lists
- Identify electrical products from photos
- Extract part numbers and specifications
- Calculate costs from images

### 💰 Budget & Cost Analysis
- Project cost estimation
- Budget breakdown by categories
- Alternative product suggestions
- Bulk pricing calculations

### 📋 Professional Quotations
- Auto-generate formatted quotations
- Include company details and terms
- Itemized pricing with taxes
- Export-ready format

### 🔍 Smart Search
- AI-powered product matching
- Context-aware suggestions
- Technical compatibility checks
- Alternative product recommendations

## 🛠️ Advanced Configuration

### Speech Settings
```typescript
// In src/config/ai.ts
SPEECH_LANGUAGE: 'en-IN',  // Indian English
SPEECH_RATE: 0.9,          // Speaking speed
SPEECH_PITCH: 1.1,         // Voice pitch
```

### Image Processing
```typescript
IMAGE_QUALITY: 0.8,        // Image compression (0.1-1.0)
MAX_IMAGE_SIZE: 1024,      // Max image dimension in pixels
```

### Chat History
```typescript
MAX_HISTORY_LENGTH: 10,    // Number of messages to remember
MAX_RESPONSE_LENGTH: 1000, // Max characters in AI response
```

## 🎭 Usage Examples

### Text Queries
- "I need a 5HP motor for my workshop"
- "What's the difference between MCB and ELCB?"
- "Calculate cost for wiring a 3-bedroom house"
- "Generate quotation for these items"

### Image Queries
- Take photo of handwritten shopping list
- Capture product label for identification
- Scan technical drawings for part numbers
- Photo of electrical panel for upgrade suggestions

### Voice Commands
- Tap and hold microphone for voice input
- AI responses can be spoken aloud
- Hands-free operation support

## 🔧 Troubleshooting

### API Key Issues
```
Error: "Please configure your Gemini API key"
```
**Solution:** Add your real API key to `src/config/ai.ts`

### Permission Errors
```
Error: "Camera permission denied"
```
**Solution:** Enable camera permissions in device settings

### Network Issues
```
Error: "Network error"
```
**Solution:** Check internet connection and API key validity

### Image Processing Errors
```
Error: "Error processing image"
```
**Solution:** Try clearer photo with better lighting

## 📊 API Usage & Limits

### Gemini Free Tier
- 60 requests per minute
- 1000 requests per day
- Free forever for moderate usage

### Best Practices
- Cache responses when possible
- Compress images before sending
- Use text queries when appropriate
- Monitor API usage in Google Cloud Console

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables in production
- Implement rate limiting for production apps
- Validate user inputs before sending to AI

## 🚀 Production Deployment

### Environment Variables
```bash
# .env.production
GEMINI_API_KEY=your_production_api_key
GEMINI_MODEL_NAME=gemini-pro-vision
```

### Performance Optimization
```typescript
// Optional: Use lighter model for simple queries
const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
```

## 🆘 Support

If you encounter issues:

1. Check the [Google AI Studio Documentation](https://ai.google.dev/docs)
2. Verify your API key is valid and has quota
3. Ensure device permissions are granted
4. Check network connectivity
5. Review console logs for detailed error messages

## 🎉 You're Ready!

Your ElectroQuick app now has a powerful AI assistant that can:
- Answer electrical questions
- Process shopping lists
- Calculate costs
- Generate quotations
- Provide technical support

**Happy selling with AI! 🤖⚡**