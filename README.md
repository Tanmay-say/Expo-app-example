# ElectroQuick ⚡

A Blinkit-style mobile marketplace app for electrical equipment built with Expo React Native.

## 🚀 Features

- **Browse Categories**: Explore electrical components by category (Cables, Switches, Circuit Breakers, Lighting, etc.)
- **Product Search**: Search products by name, manufacturer, or part number
- **Product Details**: View detailed specifications, images, and technical information
- **Shopping Cart**: Add/remove items with persistent cart storage
- **Checkout**: Complete orders with delivery address and payment options
- **Responsive Design**: Material Design UI with optimized mobile experience

## 📱 Screenshots

The app includes:
- Home screen with category grid and featured products
- Categories screen with filtering and sorting
- Product detail screen with specifications table
- Shopping cart with quantity management
- Checkout screen with address and payment options
- Search screen with advanced filters

## 🛠️ Technology Stack

- **Framework**: Expo React Native (managed workflow)
- **Navigation**: React Navigation (Bottom Tabs + Stack Navigation)
- **UI Library**: React Native Paper (Material Design)
- **State Management**: React Context + AsyncStorage
- **Language**: TypeScript
- **Image Handling**: Expo Image with caching
- **Icons**: Material Icons (@expo/vector-icons)

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd electro-quick
   yarn install
   ```

2. **Start the development server:**
   ```bash
   yarn start
   ```

3. **Run on device:**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Or use `yarn android` / `yarn ios` for emulators

## 📊 Data Sources

The app uses a local catalog (`assets/catalog.json`) with sample electrical components data. In production, this would be replaced with API calls.

### Sample Categories:
- Cables & Wires
- Switches & Protection  
- Circuit Breakers
- Lighting
- Transformers & Motors
- Connectors
- Relays & Contactors

### Future Backend Integration

The app is designed for easy backend integration. Replace the mock API service (`src/services/api.ts`) with actual REST/GraphQL endpoints:

```typescript
// TODO: Replace with actual API calls
// GET /api/categories
// GET /api/products?categoryId=...
// POST /api/products/search
// GET /api/products/:id
```

## 🗂️ Project Structure

```
electro-quick/
├── App.tsx                 # Root component with theme provider
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CategoryCard.tsx
│   │   └── ProductCard.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   └── SearchScreen.tsx
│   ├── services/          # Business logic and API
│   │   ├── api.ts         # Product data service
│   │   └── cartService.ts # Cart management with AsyncStorage
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── assets/
│   ├── catalog.json       # Sample product catalog
│   ├── icon.png          # App icon
│   ├── splash.png        # Splash screen
│   └── adaptive-icon.png # Android adaptive icon
└── package.json
```

## 🔧 Build Catalog Script

Future enhancement: Create a script to merge real electrical component datasets:

```bash
npm run build-catalog
```

This would process data from:
- Harvard Dataverse Electrical Components Dataset
- Kaggle Electronic Products & Pricing Data  
- TraceParts CAD Library thumbnails
- Roboflow electrical component images

## 🏪 Catalog Data Structure

```json
{
  "categories": [
    { "id": "cables_wires", "name": "Cables & Wires" }
  ],
  "products": [
    {
      "id": "unique-id",
      "category_id": "cables_wires", 
      "name": "Product Name",
      "manufacturer": "Brand Name",
      "part_number": "PN-12345",
      "voltage": 230,
      "current": 16,
      "description": "Product description",
      "price": 299.99,
      "image_url": "https://...",
      "stock": 50,
      "dimensions_mm": [45, 20, 60]
    }
  ]
}
```

## 🧪 Testing

Run unit tests for cart logic and search functionality:

```bash
# Future: Add Jest tests
npm test
```

## 📄 License & Credits

### Data Sources:
- Electrical & Electronic Components Dataset (Harvard Dataverse, CC-BY 4.0)
- Electronic Products and Pricing Data (Kaggle / Datafiniti)  
- Electronic Components & Devices (Kaggle / AryaMinus)
- Electrical component images (Roboflow Universe, CC-BY)
- Manufacturer CAD thumbnails (TraceParts public catalog)

## 🚧 Future Enhancements

- [ ] Real-time inventory sync
- [ ] User authentication & profiles
- [ ] Order tracking
- [ ] Push notifications
- [ ] Offline mode support
- [ ] Advanced filtering (price range, ratings)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Bulk ordering for contractors
- [ ] AR view for component sizing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable  
5. Submit a pull request

## 📞 Support

For technical support or feature requests, please open an issue in the repository.

---

**Built with ❤️ for the electrical industry**