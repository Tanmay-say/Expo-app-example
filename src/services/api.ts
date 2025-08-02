import { CatalogData, Product, Category, SearchFilters } from '../types';
import catalogData from '../../assets/catalog.json';

// TODO: Replace this local JSON import with GraphQL GET /products?categoryId=...
// Future: Add quantity-based pricing, stock sync via REST endpoint

class ApiService {
  private catalog: CatalogData;

  constructor() {
    this.catalog = catalogData as CatalogData;
  }

  // Get all categories
  async getCategories(): Promise<Category[]> {
    // TODO: Replace with API call - GET /api/categories
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.catalog.categories), 100);
    });
  }

  // Get all products or products by category
  async getProducts(categoryId?: string): Promise<Product[]> {
    // TODO: Replace with API call - GET /api/products?categoryId=...
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = categoryId 
          ? this.catalog.products.filter(p => p.category_id === categoryId)
          : this.catalog.products;
        resolve(products);
      }, 200);
    });
  }

  // Get product by ID
  async getProduct(productId: string): Promise<Product | null> {
    // TODO: Replace with API call - GET /api/products/:id
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = this.catalog.products.find(p => p.id === productId);
        resolve(product || null);
      }, 150);
    });
  }

  // Search products
  async searchProducts(filters: SearchFilters): Promise<Product[]> {
    // TODO: Replace with API call - POST /api/products/search
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = this.catalog.products;

        // Filter by category
        if (filters.categoryId) {
          results = results.filter(p => p.category_id === filters.categoryId);
        }

        // Filter by search query (name, manufacturer, part_number)
        if (filters.query) {
          const query = filters.query.toLowerCase();
          results = results.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.manufacturer.toLowerCase().includes(query) ||
            p.part_number.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
          );
        }

        // Filter by manufacturer
        if (filters.manufacturer) {
          results = results.filter(p => 
            p.manufacturer.toLowerCase() === filters.manufacturer!.toLowerCase()
          );
        }

        // Filter by price range
        if (filters.minPrice !== undefined) {
          results = results.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          results = results.filter(p => p.price <= filters.maxPrice!);
        }

        resolve(results);
      }, 300);
    });
  }

  // Get featured products (for home screen)
  async getFeaturedProducts(): Promise<Product[]> {
    // TODO: Replace with API call - GET /api/products/featured
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return first 6 products as featured
        resolve(this.catalog.products.slice(0, 6));
      }, 150);
    });
  }

  // Get product recommendations
  async getRecommendedProducts(productId: string): Promise<Product[]> {
    // TODO: Replace with API call - GET /api/products/:id/recommendations
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentProduct = this.catalog.products.find(p => p.id === productId);
        if (!currentProduct) {
          resolve([]);
          return;
        }

        // Return products from same category (excluding current product)
        const recommended = this.catalog.products
          .filter(p => p.category_id === currentProduct.category_id && p.id !== productId)
          .slice(0, 4);
        
        resolve(recommended);
      }, 200);
    });
  }
}

export const apiService = new ApiService();