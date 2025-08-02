import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart, CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'electro_quick_cart';

class CartService {
  private cart: Cart = { items: [], total: 0 };
  private listeners: Array<(cart: Cart) => void> = [];

  constructor() {
    this.loadCart();
  }

  // Load cart from AsyncStorage
  async loadCart(): Promise<void> {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        this.cart = JSON.parse(cartData);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  // Save cart to AsyncStorage
  private async saveCart(): Promise<void> {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Calculate total price
  private calculateTotal(): number {
    return this.cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  // Update cart and notify listeners
  private updateCart(): void {
    this.cart.total = this.calculateTotal();
    this.saveCart();
    this.notifyListeners();
  }

  // Add item to cart
  addItem(product: Product, quantity: number = 1): void {
    const existingItemIndex = this.cart.items.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      this.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      this.cart.items.push({ product, quantity });
    }

    this.updateCart();
  }

  // Remove item from cart
  removeItem(productId: string): void {
    this.cart.items = this.cart.items.filter(item => item.product.id !== productId);
    this.updateCart();
  }

  // Update item quantity
  updateItemQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const itemIndex = this.cart.items.findIndex(
      item => item.product.id === productId
    );

    if (itemIndex >= 0) {
      this.cart.items[itemIndex].quantity = quantity;
      this.updateCart();
    }
  }

  // Get current cart
  getCart(): Cart {
    return { ...this.cart };
  }

  // Get cart item count
  getItemCount(): number {
    return this.cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clearCart(): void {
    this.cart = { items: [], total: 0 };
    this.updateCart();
  }

  // Check if product is in cart
  isInCart(productId: string): boolean {
    return this.cart.items.some(item => item.product.id === productId);
  }

  // Get quantity of specific product in cart
  getProductQuantity(productId: string): number {
    const item = this.cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  // Subscribe to cart changes
  subscribe(listener: (cart: Cart) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getCart()));
  }
}

export const cartService = new CartService();