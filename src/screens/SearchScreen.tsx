import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Text,
  Searchbar,
  ActivityIndicator,
  useTheme,
  Chip,
  Menu,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { debounce } from 'lodash';

import { Product, Category, SearchFilters, RootStackParamList } from '../types';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const route = useRoute<SearchScreenRouteProp>();
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: route.params?.query || '',
  });
  
  // Filter menus
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [manufacturerMenuVisible, setManufacturerMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price_low' | 'price_high'>('name');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: SearchFilters) => {
      setLoading(true);
      try {
        const results = await apiService.searchProducts(searchFilters);
        setProducts(sortProducts(results, sortBy));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [sortBy]
  );

  const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  useEffect(() => {
    loadFilterData();
  }, []);

  useEffect(() => {
    if (filters.query.trim() || filters.categoryId || filters.manufacturer) {
      debouncedSearch(filters);
    } else {
      setProducts([]);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    setProducts(prev => sortProducts(prev, sortBy));
  }, [sortBy]);

  const loadFilterData = async () => {
    try {
      const [categoriesData, allProducts] = await Promise.all([
        apiService.getCategories(),
        apiService.getProducts(),
      ]);
      
      setCategories(categoriesData);
      
      // Extract unique manufacturers
      const uniqueManufacturers = Array.from(
        new Set(allProducts.map(p => p.manufacturer))
      ).sort();
      setManufacturers(uniqueManufacturers);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, query }));
  };

  const handleCategoryFilter = (categoryId: string | undefined) => {
    setFilters(prev => ({ ...prev, categoryId }));
    setCategoryMenuVisible(false);
  };

  const handleManufacturerFilter = (manufacturer: string | undefined) => {
    setFilters(prev => ({ ...prev, manufacturer }));
    setManufacturerMenuVisible(false);
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    setSortMenuVisible(false);
  };

  const clearFilters = () => {
    setFilters({ query: searchQuery });
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const getSelectedCategoryName = () => {
    if (!filters.categoryId) return 'All Categories';
    const category = categories.find(c => c.id === filters.categoryId);
    return category?.name || 'Category';
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price_low': return 'Price: Low to High';
      case 'price_high': return 'Price: High to Low';
      case 'name': 
      default: return 'Name: A to Z';
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item.id)}
    />
  );

  const hasActiveFilters = filters.categoryId || filters.manufacturer;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search products, brands, part numbers..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterChips}>
          {/* Category Filter */}
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <Chip
                selected={!!filters.categoryId}
                onPress={() => setCategoryMenuVisible(true)}
                icon="chevron-down"
                style={styles.filterChip}
              >
                {getSelectedCategoryName()}
              </Chip>
            }
          >
            <Menu.Item 
              onPress={() => handleCategoryFilter(undefined)} 
              title="All Categories"
            />
            {categories.map(category => (
              <Menu.Item
                key={category.id}
                onPress={() => handleCategoryFilter(category.id)}
                title={category.name}
              />
            ))}
          </Menu>

          {/* Manufacturer Filter */}
          <Menu
            visible={manufacturerMenuVisible}
            onDismiss={() => setManufacturerMenuVisible(false)}
            anchor={
              <Chip
                selected={!!filters.manufacturer}
                onPress={() => setManufacturerMenuVisible(true)}
                icon="chevron-down"
                style={styles.filterChip}
              >
                {filters.manufacturer || 'All Brands'}
              </Chip>
            }
          >
            <Menu.Item 
              onPress={() => handleManufacturerFilter(undefined)} 
              title="All Brands"
            />
            {manufacturers.map(manufacturer => (
              <Menu.Item
                key={manufacturer}
                onPress={() => handleManufacturerFilter(manufacturer)}
                title={manufacturer}
              />
            ))}
          </Menu>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Chip
              onPress={clearFilters}
              icon="close"
              style={styles.clearFiltersChip}
            >
              Clear
            </Chip>
          )}
        </View>

        {/* Sort */}
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setSortMenuVisible(true)}
              icon="sort"
              style={styles.sortButton}
            >
              {getSortLabel()}
            </Button>
          }
        >
          <Menu.Item 
            onPress={() => handleSort('name')} 
            title="Name: A to Z"
            leadingIcon="sort-alphabetical-ascending"
          />
          <Menu.Item 
            onPress={() => handleSort('price_low')} 
            title="Price: Low to High"
            leadingIcon="sort-numeric-ascending"
          />
          <Menu.Item 
            onPress={() => handleSort('price_high')} 
            title="Price: High to Low"
            leadingIcon="sort-numeric-descending"
          />
        </Menu>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <>
          {/* Results Count */}
          {(filters.query.trim() || hasActiveFilters) && (
            <View style={styles.resultsHeader}>
              <Text variant="bodyMedium" style={styles.resultsCount}>
                {products.length} products found
                {filters.query.trim() && ` for "${filters.query}"`}
              </Text>
            </View>
          )}

          {/* Products List */}
          {products.length === 0 ? (
            <View style={styles.emptyContainer}>
              {filters.query.trim() || hasActiveFilters ? (
                <>
                  <MaterialIcons name="search-off" size={64} color="#ccc" />
                  <Text variant="titleMedium" style={styles.emptyText}>
                    No products found
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptySubtext}>
                    Try adjusting your search or filters
                  </Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="search" size={64} color="#ccc" />
                  <Text variant="titleMedium" style={styles.emptyText}>
                    Start searching
                  </Text>
                  <Text variant="bodyMedium" style={styles.emptySubtext}>
                    Enter a product name, brand, or part number
                  </Text>
                </>
              )}
            </View>
          ) : (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.productsList}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterChips: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  clearFiltersChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#ffebee',
  },
  sortButton: {
    borderRadius: 20,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    color: '#666',
  },
  productsList: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
});