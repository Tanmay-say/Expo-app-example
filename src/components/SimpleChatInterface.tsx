import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Card, useTheme, Text, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

import { Product } from '../types';
import { config } from '../config/env';
import { aiService } from '../services/aiService';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  imageUri?: string;
  suggestedProducts?: Product[];
  totalCost?: number;
  budget?: {
    total: number;
    breakdown: { [key: string]: number };
    recommendations: string[];
  };
}

interface SimpleChatInterfaceProps {
  visible: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function SimpleChatInterface({
  visible,
  onClose,
  onProductSelect,
  onAddToCart,
}: SimpleChatInterfaceProps) {
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (visible && messages.length === 0) {
      addBotMessage("Hello! I'm ElectroQuick's AI Assistant with access to our complete product catalog. I can help you with:\n\n🔧 **Equipment Recommendations**\n💰 **Cost Calculations & Budgeting**\n📋 **Professional Quotations**\n📸 **Image Analysis** (shopping lists, product photos)\n🛠️ **Technical Support**\n\nWhat electrical equipment do you need today?");
    }
  }, [visible]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addBotMessage = (text: string, imageUri?: string, suggestedProducts?: Product[], totalCost?: number, budget?: any) => {
    addMessage({
      id: Date.now().toString(),
      text,
      isUser: false,
      imageUri,
      suggestedProducts,
      totalCost,
      budget,
    });
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
    };
    addMessage(userMessage);
    setInputText('');
    Keyboard.dismiss();
    setIsTyping(true);

    try {
      // Use the enhanced AI service with full product access
      const aiResponse = await aiService.processTextQuery(userMessage.text);
      
      addBotMessage(
        aiResponse.message,
        undefined,
        aiResponse.suggestedProducts,
        aiResponse.totalCost,
        aiResponse.budget
      );
    } catch (error) {
      console.error('AI Service Error:', error);
      addBotMessage("I'm having trouble processing your request. Please try again or contact our support team.");
    } finally {
      setIsTyping(false);
    }
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    let result;
    if (source === 'camera') {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Permission to access camera is required!');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Permission to access media library is required!');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Image uploaded for analysis.',
        isUser: true,
        imageUri: result.assets[0].uri,
      };
      addMessage(userMessage);
      setIsTyping(true);

      try {
        // Use AI service to analyze the image
        const aiResponse = await aiService.processImageQuery(result.assets[0].uri);
        
        addBotMessage(
          aiResponse.message,
          undefined,
          aiResponse.suggestedProducts,
          aiResponse.totalCost,
          aiResponse.budget
        );
      } catch (error) {
        console.error('Image Analysis Error:', error);
        addBotMessage("I'm having trouble analyzing the image. Please describe what you see, and I'll help match it with our product catalog!");
      } finally {
        setIsTyping(false);
      }
    }
  };

  const renderProductSuggestion = (product: Product) => (
    <Card key={product.id} style={styles.productCard} onPress={() => onProductSelect(product)}>
      <Card.Content style={styles.productContent}>
        <View style={styles.productRow}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.productImage}
            contentFit="cover"
          />
          <View style={styles.productInfo}>
            <Text variant="titleSmall" style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text variant="bodySmall" style={styles.productManufacturer}>
              {product.manufacturer}
            </Text>
            <Text variant="titleMedium" style={styles.productPrice}>
              ₹{product.price.toLocaleString('en-IN')}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() => onAddToCart(product)}
            style={styles.addButton}
            contentStyle={styles.addButtonContent}
          >
            Add
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderBudgetInfo = (budget: any) => (
    <Card style={styles.budgetCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.budgetTitle}>
          💰 Budget Analysis
        </Text>
        <Text variant="titleLarge" style={styles.budgetTotal}>
          ₹{budget.total.toLocaleString('en-IN')}
        </Text>
        <View style={styles.budgetBreakdown}>
          {Object.entries(budget.breakdown).map(([category, amount]) => (
            <View key={category} style={styles.budgetItem}>
              <Text variant="bodySmall">{category}</Text>
              <Text variant="bodyMedium" style={styles.budgetAmount}>
                ₹{(amount as number).toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.recommendations}>
          <Text variant="bodySmall" style={styles.recommendationsTitle}>
            💡 Recommendations:
          </Text>
          {budget.recommendations.map((rec: string, index: number) => (
            <Text key={index} variant="bodySmall" style={styles.recommendation}>
              • {rec}
            </Text>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageBubble,
      item.isUser ? styles.userBubble : styles.botBubble,
      { alignSelf: item.isUser ? 'flex-end' : 'flex-start' }
    ]}>
      <Text style={item.isUser ? styles.userText : styles.botText}>
        {item.text}
      </Text>
      {item.imageUri && (
        <Image
          source={{ uri: item.imageUri }}
          style={styles.messageImage}
          contentFit="cover"
        />
      )}
      
      {/* Render suggested products */}
      {item.suggestedProducts && item.suggestedProducts.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text variant="bodySmall" style={styles.suggestionsTitle}>
            🛒 Suggested Products:
          </Text>
          {item.suggestedProducts.slice(0, 3).map(renderProductSuggestion)}
        </View>
      )}
      
      {/* Render budget information */}
      {item.budget && renderBudgetInfo(item.budget)}
      
      {/* Show total cost if available */}
      {item.totalCost && (
        <View style={styles.totalCostContainer}>
          <Text variant="titleMedium" style={styles.totalCostText}>
            💰 Total Cost: ₹{item.totalCost.toLocaleString('en-IN')}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <IconButton
          icon="close"
          iconColor="white"
          size={24}
          onPress={onClose}
          style={styles.closeButton}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>AI Equipment Assistant</Text>
        <MaterialIcons name="psychology" size={28} color="white" style={styles.headerIcon} />
      </LinearGradient>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        inverted // Show latest messages at the bottom
      />

      {isTyping && (
        <View style={styles.typingIndicatorContainer}>
          <Text style={styles.typingIndicatorText}>AI is analyzing your request...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <IconButton
          icon="camera"
          size={24}
          onPress={() => pickImage('camera')}
          iconColor={theme.colors.primary}
        />
        <IconButton
          icon="image"
          size={24}
          onPress={() => pickImage('gallery')}
          iconColor={theme.colors.primary}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Ask about equipment, costs, or upload a shopping list..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          multiline
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
        <IconButton
          icon="send"
          size={24}
          onPress={handleSend}
          iconColor={theme.colors.primary}
          disabled={inputText.trim() === ''}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButton: {
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerIcon: {
    marginLeft: 10,
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#e0f7fa',
    borderBottomRightRadius: 2,
  },
  botBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 2,
  },
  userText: {
    color: '#00796b',
  },
  botText: {
    color: '#2d3748',
    lineHeight: 20,
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 8,
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  suggestionsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#667eea',
  },
  productCard: {
    marginVertical: 4,
    elevation: 2,
  },
  productContent: {
    padding: 8,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productManufacturer: {
    color: '#666',
    marginBottom: 2,
  },
  productPrice: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  addButton: {
    marginLeft: 8,
  },
  addButtonContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  budgetCard: {
    marginTop: 12,
    backgroundColor: '#f8f9fa',
  },
  budgetTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#667eea',
  },
  budgetTotal: {
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 12,
  },
  budgetBreakdown: {
    marginBottom: 12,
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  budgetAmount: {
    fontWeight: 'bold',
    color: '#667eea',
  },
  recommendations: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  recommendationsTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#667eea',
  },
  recommendation: {
    marginBottom: 2,
    color: '#666',
  },
  totalCostContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  totalCostText: {
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  typingIndicatorContainer: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  typingIndicatorText: {
    fontStyle: 'italic',
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    maxHeight: 100,
  },
});