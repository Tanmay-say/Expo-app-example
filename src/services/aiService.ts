
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product, Category } from '../types';
import { apiService } from './api';
import { config } from '../config/env';

// Initialize Gemini AI using environment configuration
const genAI = config.GEMINI_API_KEY !== 'your_actual_gemini_api_key_here' 
  ? new GoogleGenerativeAI(config.GEMINI_API_KEY) 
  : null;

export interface ChatMessage {
  id: string;
  text: string;
  user: {
    _id: number;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  image?: string;
  system?: boolean;
}

export interface AIResponse {
  message: string;
  suggestedProducts?: Product[];
  totalCost?: number;
  budget?: {
    total: number;
    breakdown: { [key: string]: number };
    recommendations: string[];
  };
  extractedItems?: string[];
  categories?: Category[];
}

class AIService {
  private model: any;
  private chatHistory: any[] = [];
  private products: Product[] = [];
  private categories: Category[] = [];
  private productDatabase: string = '';

  constructor() {
    if (genAI) {
      this.model = genAI.getGenerativeModel({ model: config.GEMINI_MODEL_NAME });
    }
    this.initializeProducts();
  }

  async initializeProducts() {
    try {
      this.products = await apiService.getProducts();
      this.categories = await apiService.getCategories();
      this.buildProductDatabase();
      console.log(`✅ AI Service loaded ${this.products.length} products and ${this.categories.length} categories`);
    } catch (error) {
      console.error('Failed to load products for AI:', error);
    }
  }

  private buildProductDatabase() {
    // Create a comprehensive product database for AI context
    const productData = this.products.map(product => ({
      id: product.id,
      name: product.name,
      manufacturer: product.manufacturer,
      part_number: product.part_number,
      price: product.price,
      category: this.categories.find(c => c.id === product.category_id)?.name || 'Unknown',
      voltage: product.voltage,
      current: product.current,
      description: product.description,
      stock: product.stock,
      image_url: product.image_url
    }));

    this.productDatabase = JSON.stringify(productData, null, 2);
  }

  // Enhanced text query processing with full product access
  async processTextQuery(query: string): Promise<AIResponse> {
    try {
      // If no AI model available, use intelligent fallback
      if (!this.model) {
        return this.processQueryWithFallback(query);
      }

      const context = this.buildContext();
      const prompt = `
You are ElectroQuick AI Assistant, an expert electrical equipment consultant with access to our complete product catalog.

COMPLETE PRODUCT DATABASE (${this.products.length} products):
${this.productDatabase}

CATEGORIES:
${JSON.stringify(this.categories, null, 2)}

CONTEXT: ${context}

USER QUERY: "${query}"

INSTRUCTIONS:
1. Analyze the user's equipment requirements thoroughly
2. Suggest specific products from our catalog that match their needs
3. Consider technical specifications (voltage, current, etc.)
4. Provide cost estimates and budget analysis
5. Offer alternative solutions if needed
6. Include product IDs for exact matching
7. Be professional, helpful, and accurate
8. Use Indian Rupee (₹) for all pricing
9. Consider stock availability in recommendations

Respond in JSON format:
{
  "message": "Your detailed, helpful response with specific product recommendations",
  "suggestedProducts": ["product_id1", "product_id2"],
  "totalCost": estimated_total_cost,
  "budget": {
    "total": number,
    "breakdown": {"category": amount},
    "recommendations": ["suggestion1", "suggestion2"]
  },
  "extractedItems": ["item1", "item2"] if user mentioned specific items
}
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const aiResponse = JSON.parse(text);
        
        // Enrich with actual product data
        if (aiResponse.suggestedProducts) {
          aiResponse.suggestedProducts = this.products.filter(p => 
            aiResponse.suggestedProducts.includes(p.id)
          );
        }
        
        return aiResponse;
      } catch (parseError) {
        return {
          message: text || "I'm here to help with your electrical equipment needs! How can I assist you today?",
        };
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.processQueryWithFallback(query);
    }
  }

  // Intelligent fallback when AI model is not available
  private processQueryWithFallback(query: string): AIResponse {
    const lowerQuery = query.toLowerCase();
    
    // Equipment requirement analysis
    if (lowerQuery.includes('motor') || lowerQuery.includes('transformer')) {
      const motorProducts = this.products.filter(p => 
        p.category_id === 'transformers_motors' && p.stock > 0
      );
      return {
        message: `⚙️ **Motor & Transformer Solutions**\n\nI found ${motorProducts.length} available products:\n\n${motorProducts.slice(0, 5).map(p => 
          `• **${p.name}** (${p.manufacturer})\n  - Part: ${p.part_number}\n  - Price: ₹${p.price.toLocaleString('en-IN')}\n  - ${p.voltage ? `${p.voltage}V` : ''} ${p.current ? `${p.current}A` : ''}\n`
        ).join('\n')}\n\n💰 **Total Budget Range**: ₹${Math.min(...motorProducts.map(p => p.price)).toLocaleString('en-IN')} - ₹${Math.max(...motorProducts.map(p => p.price)).toLocaleString('en-IN')}\n\nNeed specific power requirements? Tell me voltage, current, or application!`,
        suggestedProducts: motorProducts.slice(0, 5),
        totalCost: motorProducts.reduce((sum, p) => sum + p.price, 0),
        budget: {
          total: motorProducts.reduce((sum, p) => sum + p.price, 0),
          breakdown: { 'Motors & Transformers': motorProducts.reduce((sum, p) => sum + p.price, 0) },
          recommendations: [
            'Consider single-phase vs three-phase requirements',
            'Check voltage compatibility with your system',
            'Factor in installation and maintenance costs'
          ]
        }
      };
    }

    if (lowerQuery.includes('cable') || lowerQuery.includes('wire')) {
      const cableProducts = this.products.filter(p => 
        p.category_id === 'cables_wires' && p.stock > 0
      );
      return {
        message: `🔌 **Cable & Wire Solutions**\n\nAvailable options (${cableProducts.length} products):\n\n${cableProducts.slice(0, 5).map(p => 
          `• **${p.name}** (${p.manufacturer})\n  - Part: ${p.part_number}\n  - Price: ₹${p.price.toLocaleString('en-IN')}\n  - ${p.voltage ? `${p.voltage}V` : ''} ${p.current ? `${p.current}A` : ''}\n`
        ).join('\n')}\n\n💡 **Recommendations**:\n• PVC cables for indoor use\n• Armoured cables for outdoor/industrial\n• Check current rating for your load\n• Consider cable length requirements`,
        suggestedProducts: cableProducts.slice(0, 5),
        totalCost: cableProducts.reduce((sum, p) => sum + p.price, 0),
        budget: {
          total: cableProducts.reduce((sum, p) => sum + p.price, 0),
          breakdown: { 'Cables & Wires': cableProducts.reduce((sum, p) => sum + p.price, 0) },
          recommendations: [
            'Calculate total cable length needed',
            'Consider voltage drop for long runs',
            'Choose appropriate insulation type'
          ]
        }
      };
    }

    if (lowerQuery.includes('light') || lowerQuery.includes('led') || lowerQuery.includes('bulb')) {
      const lightingProducts = this.products.filter(p => 
        p.category_id === 'lighting' && p.stock > 0
      );
      return {
        message: `💡 **Lighting Solutions**\n\nBrighten your space with ${lightingProducts.length} options:\n\n${lightingProducts.slice(0, 5).map(p => 
          `• **${p.name}** (${p.manufacturer})\n  - Part: ${p.part_number}\n  - Price: ₹${p.price.toLocaleString('en-IN')}\n  - ${p.voltage ? `${p.voltage}V` : ''} ${p.current ? `${p.current}A` : ''}\n`
        ).join('\n')}\n\n🌟 **Lighting Tips**:\n• LED bulbs save 80% energy\n• Consider lumens for brightness\n• Check voltage compatibility\n• Factor in installation costs`,
        suggestedProducts: lightingProducts.slice(0, 5),
        totalCost: lightingProducts.reduce((sum, p) => sum + p.price, 0),
        budget: {
          total: lightingProducts.reduce((sum, p) => sum + p.price, 0),
          breakdown: { 'Lighting': lightingProducts.reduce((sum, p) => sum + p.price, 0) },
          recommendations: [
            'Calculate total lumens needed for your space',
            'Consider energy efficiency ratings',
            'Plan for future maintenance'
          ]
        }
      };
    }

    if (lowerQuery.includes('switch') || lowerQuery.includes('breaker') || lowerQuery.includes('protection')) {
      const protectionProducts = this.products.filter(p => 
        (p.category_id === 'switch_protection' || p.category_id === 'circuit_breakers') && p.stock > 0
      );
      return {
        message: `⚡ **Switch & Protection Equipment**\n\nSafety first with ${protectionProducts.length} products:\n\n${protectionProducts.slice(0, 5).map(p => 
          `• **${p.name}** (${p.manufacturer})\n  - Part: ${p.part_number}\n  - Price: ₹${p.price.toLocaleString('en-IN')}\n  - ${p.voltage ? `${p.voltage}V` : ''} ${p.current ? `${p.current}A` : ''}\n`
        ).join('\n')}\n\n🛡️ **Safety Guidelines**:\n• Match breaker rating to circuit load\n• Consider surge protection for sensitive equipment\n• Plan for future expansion\n• Always consult qualified electrician`,
        suggestedProducts: protectionProducts.slice(0, 5),
        totalCost: protectionProducts.reduce((sum, p) => sum + p.price, 0),
        budget: {
          total: protectionProducts.reduce((sum, p) => sum + p.price, 0),
          breakdown: { 'Protection Equipment': protectionProducts.reduce((sum, p) => sum + p.price, 0) },
          recommendations: [
            'Calculate total circuit load',
            'Consider safety regulations',
            'Plan for emergency backup systems'
          ]
        }
      };
    }

    // Budget and cost queries
    if (lowerQuery.includes('budget') || lowerQuery.includes('cost') || lowerQuery.includes('price')) {
      const totalInventory = this.products.reduce((sum, p) => sum + p.price, 0);
      const avgPrice = totalInventory / this.products.length;
      
      return {
        message: `💰 **Budget Analysis**\n\n**Complete Inventory Value**: ₹${totalInventory.toLocaleString('en-IN')}\n**Average Product Price**: ₹${avgPrice.toLocaleString('en-IN')}\n\n**Price Ranges by Category**:\n${this.categories.map(cat => {
          const catProducts = this.products.filter(p => p.category_id === cat.id);
          const minPrice = Math.min(...catProducts.map(p => p.price));
          const maxPrice = Math.max(...catProducts.map(p => p.price));
          return `• **${cat.name}**: ₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;
        }).join('\n')}\n\n💡 **Budget Tips**:\n• Start with essential equipment\n• Consider bulk discounts for large orders\n• Factor in installation and maintenance\n• Plan for future upgrades\n\nTell me your specific requirements for detailed cost breakdown!`,
        totalCost: totalInventory,
        budget: {
          total: totalInventory,
                   breakdown: this.categories.reduce((acc, cat) => {
           const catProducts = this.products.filter((p: Product) => p.category_id === cat.id);
           acc[cat.name] = catProducts.reduce((sum, p: Product) => sum + p.price, 0);
           return acc;
         }, {} as { [key: string]: number }),
          recommendations: [
            'Prioritize safety-critical equipment',
            'Consider energy-efficient options for long-term savings',
            'Plan for 10-15% contingency budget'
          ]
        }
      };
    }

    // General help
    return {
      message: `🔧 **ElectroQuick Equipment Assistant**\n\nI have access to **${this.products.length} electrical products** across **${this.categories.length} categories**!\n\n**What can I help you with?**\n\n🏭 **Equipment Categories**:\n${this.categories.map(cat => `• ${cat.name}`).join('\n')}\n\n💡 **I can help with**:\n• Equipment recommendations based on your needs\n• Cost calculations and budget planning\n• Technical specifications and compatibility\n• Project quotations and bulk pricing\n• Installation guidance and safety tips\n\n**Just tell me**:\n• What equipment you need\n• Your project requirements\n• Budget constraints\n• Technical specifications\n\nI'll provide specific product recommendations from our catalog! 🎯`,
      categories: this.categories
    };
  }

  // Process images (shopping lists, product photos)
  async processImageQuery(imageUri: string, prompt?: string): Promise<AIResponse> {
    try {
      if (!this.model) {
        return {
          message: "I can analyze images to help identify electrical equipment and shopping lists. Please describe what you see in the image, and I'll match it with our product catalog!",
        };
      }

      const imageData = await this.imageToBase64(imageUri);
      const context = this.buildContext();
      
      const analysisPrompt = `
You are ElectroQuick AI Assistant analyzing an image for electrical equipment needs.

COMPLETE PRODUCT DATABASE (${this.products.length} products):
${this.productDatabase}

CONTEXT: ${context}

IMAGE ANALYSIS TASK:
1. If this is a shopping list (handwritten/printed), extract all electrical items mentioned
2. If this is a product photo, identify the product and suggest similar items from our catalog
3. Match extracted items with our product database
4. Calculate total costs for identified items
5. Provide budget analysis and recommendations
6. Consider technical specifications and compatibility

ADDITIONAL PROMPT: "${prompt || 'Analyze this image and help me with electrical equipment needs'}"

Extract items and respond in JSON format:
{
  "message": "Detailed analysis results and helpful response",
  "extractedItems": ["item1", "item2", "item3"],
  "suggestedProducts": ["product_id1", "product_id2"],
  "totalCost": estimated_total_cost,
  "budget": {
    "total": number,
    "breakdown": {"category": amount},
    "recommendations": ["recommendation1", "recommendation2"]
  }
}
      `;

      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.model.generateContent([analysisPrompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      try {
        const aiResponse = JSON.parse(text);
        
        // Enrich with actual product data
        if (aiResponse.suggestedProducts) {
          aiResponse.suggestedProducts = this.products.filter(p => 
            aiResponse.suggestedProducts.includes(p.id)
          );
        }
        
        return aiResponse;
      } catch (parseError) {
        return {
          message: text || "I've analyzed your image. How can I help you find the right electrical equipment from our catalog?",
        };
      }
    } catch (error) {
      console.error('Image Analysis Error:', error);
      return {
        message: "I'm having trouble analyzing the image. Please describe what you see, and I'll help match it with our product catalog!",
      };
    }
  }

  // Generate professional quotation with full product data
  async generateQuotation(products: Product[], quantities: { [productId: string]: number }): Promise<string> {
    const quotationData = {
      products: products.map(p => ({
        ...p,
        quantity: quantities[p.id] || 1,
        lineTotal: p.price * (quantities[p.id] || 1)
      })),
      date: new Date().toLocaleDateString('en-IN'),
      quotationNumber: `EQ-${Date.now().toString().slice(-6)}`,
      totalItems: products.length,
      subtotal: products.reduce((sum, p) => sum + (p.price * (quantities[p.id] || 1)), 0),
      tax: products.reduce((sum, p) => sum + (p.price * (quantities[p.id] || 1)), 0) * 0.18,
      delivery: 50
    };

    const prompt = `
Generate a professional quotation for ElectroQuick with this data:
${JSON.stringify(quotationData, null, 2)}

Format as a professional business quotation with:
- Header with company details
- Quotation number and date
- Itemized list with quantities and pricing
- Subtotal, taxes, and total
- Terms and conditions
- Professional formatting
    `;

    try {
      if (!this.model) {
        return this.generateQuotationFallback(quotationData);
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Quotation Generation Error:', error);
      return this.generateQuotationFallback(quotationData);
    }
  }

  private generateQuotationFallback(data: any): string {
    const total = data.subtotal + data.tax + data.delivery;
    
    return `
================================================================
                    ELECTROQUICK SOLUTIONS
================================================================
                    PROFESSIONAL QUOTATION

Quotation No: ${data.quotationNumber}
Date: ${data.date}
Valid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}

================================================================
ITEM DESCRIPTION                    QTY    RATE        AMOUNT
================================================================
${data.products.map((p: any) => 
  `${p.name.padEnd(30)} ${p.quantity.toString().padStart(4)} ₹${p.price.toString().padStart(8)} ₹${p.lineTotal.toString().padStart(10)}`
).join('\n')}

================================================================
Subtotal:                                    ₹${data.subtotal.toLocaleString('en-IN')}
GST (18%):                                   ₹${data.tax.toLocaleString('en-IN')}
Delivery Charges:                            ₹${data.delivery.toLocaleString('en-IN')}
================================================================
TOTAL:                                       ₹${total.toLocaleString('en-IN')}
================================================================

Terms & Conditions:
• Prices valid for 30 days
• Delivery within 3-5 business days
• Payment: 50% advance, balance on delivery
• Warranty as per manufacturer terms
• Installation charges extra if required

Contact: support@electroquick.com | +91-9876543210
================================================================
    `;
  }

  // Smart product search with full catalog access
  async smartSearch(query: string): Promise<Product[]> {
    const searchPrompt = `
Based on this search query: "${query}"
And these available products: ${this.productDatabase}

Return the most relevant product IDs as a JSON array: ["id1", "id2", "id3"]
Consider:
- Product names and descriptions
- Technical specifications
- Use cases and applications
- Alternative products that might satisfy the need
- Stock availability
    `;

    try {
      if (!this.model) {
        // Fallback to intelligent search
        return this.intelligentSearch(query);
      }

      const result = await this.model.generateContent(searchPrompt);
      const response = await result.response;
      const text = response.text();
      
      const productIds = JSON.parse(text);
      return this.products.filter(p => productIds.includes(p.id));
    } catch (error) {
      console.error('Smart Search Error:', error);
      return this.intelligentSearch(query);
    }
  }

  private intelligentSearch(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    const keywords = lowerQuery.split(' ').filter(word => word.length > 2);
    
    return this.products.filter(product => {
      const searchText = `${product.name} ${product.manufacturer} ${product.part_number} ${product.description || ''}`.toLowerCase();
      
      // Exact matches get highest priority
      if (searchText.includes(lowerQuery)) return true;
      
      // Keyword matches
      const keywordMatches = keywords.filter(keyword => searchText.includes(keyword));
      return keywordMatches.length >= Math.ceil(keywords.length * 0.6); // 60% keyword match
    }).sort((a, b) => {
      // Sort by relevance and stock availability
      const aScore = (a.stock > 0 ? 10 : 0) + (a.name.toLowerCase().includes(lowerQuery) ? 5 : 0);
      const bScore = (b.stock > 0 ? 10 : 0) + (b.name.toLowerCase().includes(lowerQuery) ? 5 : 0);
      return bScore - aScore;
    });
  }

  private buildContext(): string {
    return `
ElectroQuick is a premium electrical equipment e-commerce platform.
We offer ${this.products.length} products across ${this.categories.length} categories: ${this.categories.map(c => c.name).join(', ')}.
Our customers are electricians, contractors, engineers, and DIY enthusiasts.
We provide technical support, competitive pricing, and fast delivery.
Currency: Indian Rupees (₹)
Tax Rate: 18%
Free delivery on orders above ₹${config.FREE_DELIVERY_THRESHOLD}
    `;
  }

  private async imageToBase64(uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('Failed to convert image to base64');
    }
  }

  addToChatHistory(role: string, content: string) {
    this.chatHistory.push({ role, content });
    // Keep last 10 messages for context
    if (this.chatHistory.length > 10) {
      this.chatHistory = this.chatHistory.slice(-10);
    }
  }

  // Get product statistics for AI context
  getProductStats() {
    return {
      totalProducts: this.products.length,
      categories: this.categories.length,
      inStock: this.products.filter(p => p.stock > 0).length,
      priceRange: {
        min: Math.min(...this.products.map(p => p.price)),
        max: Math.max(...this.products.map(p => p.price)),
        average: this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length
      }
    };
  }
}

export const aiService = new AIService();