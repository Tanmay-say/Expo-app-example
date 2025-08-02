import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { Image } from 'expo-image';
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
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
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
          
          <Text variant="bodySmall" style={styles.manufacturer}>
            {product.manufacturer}
          </Text>
          
          <View style={styles.priceRow}>
            <Text variant="titleMedium" style={[styles.price, { color: theme.colors.primary }]}>
              {formatPrice(product.price)}
            </Text>
            {product.stock > 0 && (
              <Button
                mode={isInCart ? "contained-tonal" : "contained"}
                onPress={handleAddToCart}
                style={styles.addButton}
                contentStyle={styles.addButtonContent}
                icon={isInCart ? "check" : "plus"}
              >
                {isInCart ? "Added" : "Add"}
              </Button>
            )}
          </View>
          
          {product.voltage && (
            <View style={styles.specRow}>
              <MaterialIcons name="flash-on" size={12} color="#666" />
              <Text variant="bodySmall" style={styles.specText}>
                {product.voltage}V
              </Text>
              {product.current && (
                <>
                  <MaterialIcons name="bolt" size={12} color="#666" style={styles.specIcon} />
                  <Text variant="bodySmall" style={styles.specText}>
                    {product.current}A
                  </Text>
                </>
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
    elevation: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
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
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  title: {
    marginBottom: 4,
    fontWeight: '500',
  },
  manufacturer: {
    color: '#666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 20,
  },
  addButtonContent: {
    paddingHorizontal: 8,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specText: {
    color: '#666',
    marginLeft: 2,
  },
  specIcon: {
    marginLeft: 8,
  },
});