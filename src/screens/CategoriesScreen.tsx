import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  useTheme,
  Menu,
  Button,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { Category, Product, RootStackParamList, MainTabsParamList } from '../types';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type CategoriesScreenRouteProp = RouteProp<MainTabsParamList, 'Categories'>;

export default function CategoriesScreen() {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const route = useRoute<CategoriesScreenRouteProp>();
  const theme = useTheme();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    route.params?.categoryId || null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price_low' | 'price_high'>('name');

  const loadData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getProducts(selectedCategoryId || undefined),
      ]);
      
      setCategories(categoriesData);
      setProducts(sortProducts(productsData, sortBy));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
    loadData();
  }, [selectedCategoryId]);

  useEffect(() => {
    setProducts(prev => sortProducts(prev, sortBy));
  }, [sortBy]);

  // Update selected category when route params change
  useEffect(() => {
    if (route.params?.categoryId && route.params.categoryId !== selectedCategoryId) {
      setSelectedCategoryId(route.params.categoryId);
    }
  }, [route.params?.categoryId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setLoading(true);
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    setSortMenuVisible(false);
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategoryId) return 'All Categories';
    const category = categories.find(c => c.id === selectedCategoryId);
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

  const renderCategoryChip = ({ item }: { item: Category }) => (
    <Chip
      key={item.id}
      selected={selectedCategoryId === item.id}
      onPress={() => handleCategorySelect(item.id)}
      style={styles.categoryChip}
    >
      {item.name}
    </Chip>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          {getSelectedCategoryName()}
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          {products.length} products available
        </Text>
      </View>

      {/* Category Filter */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={[{ id: 'all', name: 'All' }, ...categories]}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategoryId === (item.id === 'all' ? null : item.id)}
              onPress={() => handleCategorySelect(item.id === 'all' ? null : item.id)}
              style={styles.categoryChip}
            >
              {item.name}
            </Chip>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Sort Controls */}
      <View style={styles.controlsContainer}>
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

      {/* Products List */}
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="inventory" size={64} color="#ccc" />
          <Text variant="titleMedium" style={styles.emptyText}>
            No products found
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Try selecting a different category
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 8,
  },
  sortButton: {
    borderRadius: 20,
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