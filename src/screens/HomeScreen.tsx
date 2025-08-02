import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Searchbar,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

import { Category, Product, RootStackParamList } from '../types';
import { apiService } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import GradientBanner from '../components/GradientBanner';
import PromoBanner from '../components/PromoBanner';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getFeaturedProducts(),
      ]);
      
      setCategories(categoriesData);
      setFeaturedProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search', { query: searchQuery });
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('MainTabs', {
      screen: 'Categories',
      params: { categoryId },
    } as any);
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryCard
      category={item}
      onPress={() => handleCategoryPress(item.id)}
    />
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item.id)}
    />
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.centerContainer}
      >
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Loading ElectroQuick...</Text>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stylish Banner */}
        <GradientBanner
          title="ElectroQuick ⚡"
          subtitle="Your Premium Electrical Equipment Store"
          icon="flash-on"
          colors={['#667eea', '#764ba2', '#f093fb']}
        />

        {/* Promo Banner */}
        <PromoBanner
          title="Special Offer! 🎉"
          subtitle="Get 20% off on all electrical components"
          discount="SAVE20"
          onPress={() => {}}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="🔍 Search products, brands, part numbers..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            onIconPress={handleSearch}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor="#667eea"
          />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            🏪 Shop by Category
          </Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.categoriesGrid}
          />
        </View>

        {/* Featured Products Section */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            ⭐ Featured Products
          </Text>
          <FlatList
            data={featuredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
        
        {/* Spacer for better scrolling */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  searchBar: {
    elevation: 8,
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  sectionTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
  },
  categoriesGrid: {
    paddingBottom: 8,
  },
  productsGrid: {
    paddingBottom: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});