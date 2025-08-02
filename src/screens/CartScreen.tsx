import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  IconButton,
  useTheme,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';

import { Cart, CartItem, RootStackParamList } from '../types';
import { cartService } from '../services/cartService';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const theme = useTheme();
  
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    const unsubscribe = cartService.subscribe((updatedCart) => {
      setCart(updatedCart);
    });

    // Initial load
    setCart(cartService.getCart());

    return unsubscribe;
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      cartService.updateItemQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => cartService.removeItem(productId),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => cartService.clearCart(),
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart first.');
      return;
    }
    
    navigation.navigate('Checkout');
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleContinueShopping = () => {
    navigation.navigate('MainTabs', { screen: 'Home' } as any);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const { product, quantity } = item;
    const itemTotal = product.price * quantity;

    return (
      <Card style={styles.itemCard}>
        <TouchableOpacity onPress={() => handleProductPress(product.id)}>
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: product.image_url }}
              style={styles.itemImage}
              contentFit="cover"
            />
            
            <View style={styles.itemDetails}>
              <Text variant="titleMedium" numberOfLines={2} style={styles.itemName}>
                {product.name}
              </Text>
              
              <Text variant="bodySmall" style={styles.itemManufacturer}>
                {product.manufacturer}
              </Text>
              
              <Text variant="bodySmall" style={styles.itemPartNumber}>
                Part: {product.part_number}
              </Text>
              
              <View style={styles.priceContainer}>
                <Text variant="titleMedium" style={[styles.itemPrice, { color: theme.colors.primary }]}>
                  {formatPrice(product.price)}
                </Text>
                <Text variant="bodySmall" style={styles.unitPrice}>
                  per unit
                </Text>
              </View>
            </View>
            
            <View style={styles.quantityContainer}>
              <IconButton
                icon="minus"
                size={20}
                onPress={() => handleQuantityChange(product.id, quantity - 1)}
                style={styles.quantityButton}
              />
              
              <Text variant="titleMedium" style={styles.quantity}>
                {quantity}
              </Text>
              
              <IconButton
                icon="plus"
                size={20}
                onPress={() => handleQuantityChange(product.id, quantity + 1)}
                style={styles.quantityButton}
              />
              
              <IconButton
                icon="delete"
                size={20}
                onPress={() => handleRemoveItem(product.id)}
                style={[styles.removeButton, { backgroundColor: '#ffebee' }]}
                iconColor="#f44336"
              />
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.itemFooter}>
            <Text variant="titleMedium" style={styles.itemTotal}>
              Subtotal: {formatPrice(itemTotal)}
            </Text>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  if (cart.items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Shopping Cart
          </Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={80} color="#ccc" />
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Your cart is empty
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Add some electrical components to get started
          </Text>
          
          <Button
            mode="contained"
            onPress={handleContinueShopping}
            style={styles.shopButton}
            icon="shopping"
          >
            Continue Shopping
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Shopping Cart
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          {cart.items.length} items
        </Text>
      </View>

      <FlatList
        data={cart.items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={handleClearCart}
              style={styles.clearButton}
              textColor="#f44336"
            >
              Clear Cart
            </Button>
          </View>
        }
      />

      {/* Bottom Total and Checkout */}
      <View style={[styles.bottomContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text variant="titleLarge">Total:</Text>
            <Text variant="headlineSmall" style={[styles.totalPrice, { color: theme.colors.primary }]}>
              {formatPrice(cart.total)}
            </Text>
          </View>
          
          <Text variant="bodySmall" style={styles.taxNote}>
            Inclusive of all taxes
          </Text>
        </View>
        
        <Button
          mode="contained"
          onPress={handleCheckout}
          style={styles.checkoutButton}
          contentStyle={styles.checkoutButtonContent}
          icon="arrow-right"
        >
          Proceed to Checkout
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContainer: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 16,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  itemManufacturer: {
    color: '#666',
    marginBottom: 2,
  },
  itemPartNumber: {
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  unitPrice: {
    color: '#666',
    marginLeft: 4,
  },
  quantityContainer: {
    alignItems: 'center',
  },
  quantityButton: {
    margin: 0,
  },
  quantity: {
    marginVertical: 8,
    minWidth: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 8,
  },
  divider: {
    marginHorizontal: 16,
  },
  itemFooter: {
    padding: 16,
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  clearButton: {
    borderColor: '#f44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  shopButton: {
    marginTop: 24,
  },
  bottomContainer: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 20,
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontWeight: 'bold',
  },
  taxNote: {
    color: '#666',
    marginTop: 4,
  },
  checkoutButton: {
    borderRadius: 25,
  },
  checkoutButtonContent: {
    paddingVertical: 8,
  },
});