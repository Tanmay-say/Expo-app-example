import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  RadioButton,
  useTheme,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { Cart, RootStackParamList } from '../types';
import { cartService } from '../services/cartService';

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const theme = useTheme();
  
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState<DeliveryAddress>({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    const currentCart = cartService.getCart();
    setCart(currentCart);
    
    // If cart is empty, go back
    if (currentCart.items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Please add some items first.');
      navigation.goBack();
    }
  }, []);

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!address.name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }
    if (!address.phone.trim() || address.phone.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }
    if (!address.address.trim()) {
      Alert.alert('Validation Error', 'Please enter your address');
      return false;
    }
    if (!address.city.trim()) {
      Alert.alert('Validation Error', 'Please enter your city');
      return false;
    }
    if (!address.pincode.trim() || address.pincode.length !== 6) {
      Alert.alert('Validation Error', 'Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      cartService.clearCart();
      
      Alert.alert(
        'Order Placed Successfully!',
        `Your order has been placed successfully. Order will be delivered to:\n\n${address.name}\n${address.address}\n${address.city}, ${address.pincode}\n\nPayment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}\n\nTotal Amount: ${formatPrice(cart.total)}`,
        [
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Home' } as any)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const deliveryCharges = cart.total > 500 ? 0 : 50;
  const finalTotal = cart.total + deliveryCharges;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <Card.Title
            title="Order Summary"
            left={(props) => <MaterialIcons {...props} name="receipt" size={24} />}
          />
          <Card.Content>
            {cart.items.map((item, index) => (
              <View key={item.product.id}>
                <View style={styles.summaryItem}>
                  <Text variant="bodyMedium" numberOfLines={2} style={styles.summaryItemName}>
                    {item.product.name}
                  </Text>
                  <Text variant="bodyMedium">
                    {item.quantity} × {formatPrice(item.product.price)}
                  </Text>
                </View>
                {index < cart.items.length - 1 && <Divider style={styles.summaryDivider} />}
              </View>
            ))}
            
            <Divider style={styles.totalDivider} />
            
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Subtotal:</Text>
              <Text variant="bodyMedium">{formatPrice(cart.total)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Delivery charges:</Text>
              <Text variant="bodyMedium" style={deliveryCharges === 0 ? styles.freeDelivery : undefined}>
                {deliveryCharges === 0 ? 'FREE' : formatPrice(deliveryCharges)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text variant="titleMedium" style={styles.totalLabel}>Total:</Text>
              <Text variant="titleLarge" style={[styles.totalAmount, { color: theme.colors.primary }]}>
                {formatPrice(finalTotal)}
              </Text>
            </View>
            
            {cart.total <= 500 && (
              <Text variant="bodySmall" style={styles.deliveryNote}>
                Add ₹{500 - cart.total} more for free delivery
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Delivery Address */}
        <Card style={styles.addressCard}>
          <Card.Title
            title="Delivery Address"
            left={(props) => <MaterialIcons {...props} name="location-on" size={24} />}
          />
          <Card.Content>
            <TextInput
              label="Full Name *"
              value={address.name}
              onChangeText={(text) => handleAddressChange('name', text)}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Phone Number *"
              value={address.phone}
              onChangeText={(text) => handleAddressChange('phone', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
              maxLength={10}
            />
            
            <TextInput
              label="Address *"
              value={address.address}
              onChangeText={(text) => handleAddressChange('address', text)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.addressRow}>
              <TextInput
                label="City *"
                value={address.city}
                onChangeText={(text) => handleAddressChange('city', text)}
                style={[styles.input, styles.cityInput]}
                mode="outlined"
              />
              
              <TextInput
                label="Pincode *"
                value={address.pincode}
                onChangeText={(text) => handleAddressChange('pincode', text)}
                style={[styles.input, styles.pincodeInput]}
                mode="outlined"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Payment Method */}
        <Card style={styles.paymentCard}>
          <Card.Title
            title="Payment Method"
            left={(props) => <MaterialIcons {...props} name="payment" size={24} />}
          />
          <Card.Content>
            <View style={styles.paymentOption}>
              <RadioButton
                value="cod"
                status={paymentMethod === 'cod' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod('cod')}
              />
              <View style={styles.paymentLabel}>
                <Text variant="bodyLarge">Cash on Delivery</Text>
                <Text variant="bodySmall" style={styles.paymentSubtext}>
                  Pay when you receive your order
                </Text>
              </View>
            </View>
            
            <View style={styles.paymentOption}>
              <RadioButton
                value="online"
                status={paymentMethod === 'online' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod('online')}
              />
              <View style={styles.paymentLabel}>
                <Text variant="bodyLarge">Online Payment</Text>
                <Text variant="bodySmall" style={styles.paymentSubtext}>
                  UPI, Cards, Net Banking (Coming Soon)
                </Text>
              </View>
            </View>
            
            {paymentMethod === 'online' && (
              <Text variant="bodySmall" style={styles.comingSoonNote}>
                Online payment option will be available soon. Please use Cash on Delivery for now.
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.bottomContainer, { backgroundColor: theme.colors.surface }]}>
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          loading={processing}
          disabled={processing || paymentMethod === 'online'}
          style={styles.placeOrderButton}
          contentStyle={styles.placeOrderButtonContent}
          icon="check-circle"
        >
          {processing ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  summaryItemName: {
    flex: 1,
    marginRight: 8,
  },
  summaryDivider: {
    marginVertical: 4,
  },
  totalDivider: {
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  freeDelivery: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  deliveryNote: {
    color: '#ff9800',
    marginTop: 8,
    fontStyle: 'italic',
  },
  addressCard: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cityInput: {
    flex: 1,
  },
  pincodeInput: {
    flex: 0.6,
  },
  paymentCard: {
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentLabel: {
    flex: 1,
    marginLeft: 8,
  },
  paymentSubtext: {
    color: '#666',
    marginTop: 2,
  },
  comingSoonNote: {
    color: '#ff9800',
    marginTop: 12,
    fontStyle: 'italic',
  },
  bottomContainer: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 20,
  },
  placeOrderButton: {
    borderRadius: 25,
  },
  placeOrderButtonContent: {
    paddingVertical: 8,
  },
});