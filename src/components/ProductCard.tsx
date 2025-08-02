import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Button, useTheme, Chip } from 'react-native-paper';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../types';
import { cartService } from '../services/cartService';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const theme = useTheme();
  const [isInCart, setIsInCart] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = cartService.subscribe(() => {
      setIsInCart(cartService.isInCart(product.id));
    });

    // Initial check
    setIsInCart(cartService.isInCart(product.id));

    return unsubscribe;
  }, [product.id]);

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    cartService.addItem(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          
          {/* Stock Status Badge */}
          <View style={styles.badgeContainer}>
            <Chip
              icon={product.stock > 0 ? "check-circle" : "cancel"}
              style={[
                styles.stockBadge,
                { backgroundColor: product.stock > 0 ? '#00b894' : '#ff6b6b' }
              ]}
              textStyle={styles.badgeText}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Chip>
          </View>
          
          {product.stock === 0 && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>
        
        <Card.Content style={styles.content}>
          <Text variant="titleSmall" numberOfLines={2} style={styles.title}>
            {product.name}
          </Text>
          
          <View style={styles.manufacturerRow}>
            <MaterialIcons name="business" size={14} color="#74b9ff" />
            <Text variant="bodySmall" style={styles.manufacturer}>
              {product.manufacturer}
            </Text>
          </View>
          
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.priceContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text variant="titleMedium" style={styles.price}>
              {formatPrice(product.price)}
            </Text>
          </LinearGradient>
          
          {product.stock > 0 && (
            <Button
              mode={isInCart ? "contained-tonal" : "contained"}
              onPress={handleAddToCart}
              style={[
                styles.addButton,
                { backgroundColor: isInCart ? '#00b894' : '#667eea' }
              ]}
              contentStyle={styles.addButtonContent}
              icon={isInCart ? "check" : "plus"}
              textColor="white"
            >
              {isInCart ? "Added" : "Add to Cart"}
            </Button>
          )}
          
          {product.voltage && (
            <View style={styles.specsContainer}>
              <View style={styles.specChip}>
                <MaterialIcons name="flash-on" size={12} color="#ffeaa7" />
                <Text variant="bodySmall" style={styles.specText}>
                  {product.voltage}V
                </Text>
              </View>
              {product.current && (
                <View style={styles.specChip}>
                  <MaterialIcons name="bolt" size={12} color="#ffeaa7" />
                  <Text variant="bodySmall" style={styles.specText}>
                    {product.current}A
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
  card: {
    elevation: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: '#f8fafc',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
  },
  stockBadge: {
    elevation: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
    zIndex: 1,
  },
  outOfStockText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  manufacturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  manufacturer: {
    color: '#74b9ff',
    marginLeft: 4,
    fontWeight: '600',
  },
  priceContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  price: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    borderRadius: 25,
    marginBottom: 8,
    elevation: 4,
  },
  addButtonContent: {
    paddingVertical: 8,
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  specText: {
    color: '#ffeaa7',
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 10,
  },
});