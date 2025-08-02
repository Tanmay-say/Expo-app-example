import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import SimpleChatInterface from '../components/SimpleChatInterface';
import { Product, RootStackParamList } from '../types';
import { cartService } from '../services/cartService';

type AIAssistantScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function AIAssistantScreen() {
  const navigation = useNavigation<AIAssistantScreenNavigationProp>();

  const handleProductSelect = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleAddToCart = async (products: Product[], quantities?: { [key: string]: number }) => {
    try {
      for (const product of products) {
        const quantity = quantities?.[product.id] || 1;
        await cartService.addItem({
          id: product.id,
          product,
          quantity,
        });
      }
      
      // Show success feedback (you could add a toast notification here)
      console.log('Products added to cart successfully');
    } catch (error) {
      console.error('Failed to add products to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <SimpleChatInterface
        visible={true}
        onClose={() => {}} // Not used in full screen mode
        onProductSelect={handleProductSelect}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});