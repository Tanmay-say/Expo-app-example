export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  manufacturer: string;
  part_number: string;
  voltage?: number;
  current?: number;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  dimensions_mm?: number[] | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CatalogData {
  categories: Category[];
  products: Product[];
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { productId: string };
  Checkout: undefined;
  Search: { query?: string };
  AIAssistant: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Categories: { categoryId?: string };
  Cart: undefined;
  AIAssistant: undefined;
};

// Search filters
export interface SearchFilters {
  query: string;
  categoryId?: string;
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
}

// API response types (for future backend integration)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}