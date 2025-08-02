import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  ActivityIndicator,
  useTheme,
  DataTable,
  Chip,
  Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';

import { Product, RootStackParamList } from '../types';
import { apiService } from '../services/api';
import { cartService } from '../services/cartService';
import ProductCard from '../components/ProductCard';

type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const { width: screenWidth } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const theme = useTheme();
  
  const { productId } = route.params;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  useEffect(() => {
    const unsubscribe = cartService.subscribe(() => {
      if (product) {
        setIsInCart(cartService.isInCart(product.id));
      }
    });

    return unsubscribe;
  }, [product]);

  const loadProductDetails = async () => {
    try {
      const [productData, recommendedData] = await Promise.all([
        apiService.getProduct(productId),
        apiService.getRecommendedProducts(productId),
      ]);
      
      if (productData) {
        setProduct(productData);
        setIsInCart(cartService.isInCart(productData.id));
        setRecommendedProducts(recommendedData);
      } else {
        Alert.alert('Error', 'Product not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      cartService.addItem(product, quantity);
      Alert.alert(
        'Added to Cart',
        `${product.name} has been added to your cart`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    cartService.addItem(product, quantity);
    navigation.navigate('MainTabs', { screen: 'Cart' } as any);
  };

  const handleRecommendedProductPress = (productId: string) => {
    navigation.push('ProductDetail', { productId });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDimensions = (dimensions: number[]) => {
    return `${dimensions[0]} × ${dimensions[1]} × ${dimensions[2]} mm`;
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <MaterialIcons name="error" size={64} color="#ccc" />
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          {product.stock === 0 && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Product Information */}
        <View style={styles.contentContainer}>
          <Text variant="headlineSmall" style={styles.productName}>
            {product.name}
          </Text>
          
          <View style={styles.manufacturerRow}>
            <MaterialIcons name="business" size={16} color="#666" />
            <Text variant="bodyLarge" style={styles.manufacturer}>
              {product.manufacturer}
            </Text>
          </View>

          <Text variant="bodyMedium" style={styles.partNumber}>
            Part Number: {product.part_number}
          </Text>

          <Text variant="headlineMedium" style={[styles.price, { color: theme.colors.primary }]}>
            {formatPrice(product.price)}
          </Text>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Chip
              icon={product.stock > 0 ? "check-circle" : "cancel"}
              style={[
                styles.stockChip,
                { backgroundColor: product.stock > 0 ? '#e8f5e8' : '#ffe8e8' }
              ]}
              textStyle={{
                color: product.stock > 0 ? '#4caf50' : '#f44336'
              }}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Chip>
          </View>

          {/* Description */}
          <Card style={styles.descriptionCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Description
              </Text>
              <Text variant="bodyMedium" style={styles.description}>
                {product.description}
              </Text>
            </Card.Content>
          </Card>

          {/* Specifications */}
          <Card style={styles.specsCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Specifications
              </Text>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell>Part Number</DataTable.Cell>
                  <DataTable.Cell>{product.part_number}</DataTable.Cell>
                </DataTable.Row>
                
                <DataTable.Row>
                  <DataTable.Cell>Manufacturer</DataTable.Cell>
                  <DataTable.Cell>{product.manufacturer}</DataTable.Cell>
                </DataTable.Row>

                {product.voltage && (
                  <DataTable.Row>
                    <DataTable.Cell>Voltage</DataTable.Cell>
                    <DataTable.Cell>{product.voltage}V</DataTable.Cell>
                  </DataTable.Row>
                )}

                {product.current && (
                  <DataTable.Row>
                    <DataTable.Cell>Current</DataTable.Cell>
                    <DataTable.Cell>{product.current}A</DataTable.Cell>
                  </DataTable.Row>
                )}

                {product.dimensions_mm && (
                  <DataTable.Row>
                    <DataTable.Cell>Dimensions</DataTable.Cell>
                    <DataTable.Cell>{formatDimensions(product.dimensions_mm)}</DataTable.Cell>
                  </DataTable.Row>
                )}

                <DataTable.Row>
                  <DataTable.Cell>Stock</DataTable.Cell>
                  <DataTable.Cell>{product.stock} units</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </Card.Content>
          </Card>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <View style={styles.recommendedSection}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                You might also like
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendedList}
              >
                {recommendedProducts.map((item) => (
                  <View key={item.id} style={styles.recommendedItem}>
                    <ProductCard
                      product={item}
                      onPress={() => handleRecommendedProductPress(item.id)}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {product.stock > 0 && (
        <View style={[styles.actionBar, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.actionContent}>
            <Button
              mode="outlined"
              onPress={handleAddToCart}
              loading={addingToCart}
              disabled={addingToCart}
              style={styles.addToCartButton}
              icon={isInCart ? "check" : "cart-plus"}
            >
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </Button>
            
            <Button
              mode="contained"
              onPress={handleBuyNow}
              style={styles.buyNowButton}
              icon="flash-on"
            >
              Buy Now
            </Button>
          </View>
        </View>
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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: 'white',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  manufacturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  manufacturer: {
    marginLeft: 4,
    color: '#666',
  },
  partNumber: {
    color: '#666',
    marginBottom: 16,
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stockContainer: {
    marginBottom: 16,
  },
  stockChip: {
    alignSelf: 'flex-start',
  },
  descriptionCard: {
    marginBottom: 16,
  },
  specsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    lineHeight: 20,
  },
  recommendedSection: {
    marginTop: 8,
  },
  recommendedList: {
    paddingRight: 16,
  },
  recommendedItem: {
    width: 180,
    marginRight: 12,
  },
  actionBar: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
  },
  buyNowButton: {
    flex: 1,
  },
});