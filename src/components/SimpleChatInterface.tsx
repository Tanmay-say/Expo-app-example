import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IconButton, Card, Chip, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { aiService, AIResponse } from '../services/aiService';
import { Product } from '../types';
import { config } from '../config/env';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
  suggestedProducts?: Product[];
  totalCost?: number;
  budget?: {
    total: number;
    breakdown: { [key: string]: number };
    recommendations: string[];
  };
}

const SimpleChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Add welcome message
    addBotMessage(
      "🔧 **ElectroQuick AI Assistant**\n\nI can help you with:\n• Equipment recommendations\n• Product search\n• Technical specifications\n• Cost calculations\n• Project quotations\n\nWhat electrical equipment do you need today?",
      [],
      undefined,
      undefined
    );
  }, []);

  const addUserMessage = (text: string, image?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      image,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (
    text: string, 
    suggestedProducts?: Product[], 
    totalCost?: number,
    budget?: {
      total: number;
      breakdown: { [key: string]: number };
      recommendations: string[];
    }
  ) => {
    const newMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text,
      isUser: false,
      timestamp: new Date(),
      suggestedProducts,
      totalCost,
      budget,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            // Add welcome message back
            addBotMessage(
              "🔧 **ElectroQuick AI Assistant**\n\nI can help you with:\n• Equipment recommendations\n• Product search\n• Technical specifications\n• Cost calculations\n• Project quotations\n\nWhat electrical equipment do you need today?",
              [],
              undefined,
              undefined
            );
          },
        },
      ]
    );
  };

  const refreshChat = () => {
    setMessages([]);
    // Add welcome message back
    addBotMessage(
      "🔧 **ElectroQuick AI Assistant**\n\nI can help you with:\n• Equipment recommendations\n• Product search\n• Technical specifications\n• Cost calculations\n• Project quotations\n\nWhat electrical equipment do you need today?",
      [],
      undefined,
      undefined
    );
  };

  const generateAIResponse = async (query: string, imageUri?: string) => {
    setIsLoading(true);
    try {
      let response: AIResponse;
      
      if (imageUri) {
        response = await aiService.processImageQuery(imageUri, query);
      } else {
        response = await aiService.processTextQuery(query);
      }

      addBotMessage(
        response.message,
        response.suggestedProducts,
        response.totalCost,
        response.budget
      );
    } catch (error) {
      console.error('AI Response Error:', error);
      addBotMessage(
        "I'm having trouble processing your request. Please try again or rephrase your question.",
        [],
        undefined,
        undefined
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const text = inputText.trim();
    const image = selectedImage;

    addUserMessage(text, image);
    setInputText('');
    setSelectedImage(undefined);

    await generateAIResponse(text, image);
  };

  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const renderProductSuggestion = (product: Product) => (
    <Card key={product.id} style={styles.productCard}>
      <Card.Cover source={{ uri: product.image_url }} style={styles.productImage} />
      <Card.Content style={styles.productContent}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productManufacturer}>{product.manufacturer}</Text>
        <Text style={styles.productPrice}>
          ₹{product.price.toLocaleString('en-IN')}
        </Text>
        <View style={styles.productSpecs}>
          {product.voltage && (
            <Chip mode="outlined" style={styles.specChip}>
              {product.voltage}V
            </Chip>
          )}
          {product.current && (
            <Chip mode="outlined" style={styles.specChip}>
              {product.current}A
            </Chip>
          )}
        </View>
        <Button
          mode="contained"
          onPress={() => {
            // TODO: Add to cart functionality
            Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
          }}
          style={styles.addButton}
        >
          Add to Cart
        </Button>
      </Card.Content>
    </Card>
  );

  const renderBudgetInfo = (budget: {
    total: number;
    breakdown: { [key: string]: number };
    recommendations: string[];
  }) => (
    <Card style={styles.budgetCard}>
      <Card.Content>
        <Text style={styles.budgetTitle}>💰 Budget Breakdown</Text>
        <Text style={styles.budgetTotal}>
          Total: ₹{budget.total.toLocaleString('en-IN')}
        </Text>
        
        {Object.entries(budget.breakdown).map(([category, amount]) => (
          <View key={category} style={styles.budgetItem}>
            <Text style={styles.budgetCategory}>{category}</Text>
            <Text style={styles.budgetAmount}>₹{amount.toLocaleString('en-IN')}</Text>
          </View>
        ))}
        
        <Text style={styles.recommendationsTitle}>💡 Recommendations:</Text>
        {budget.recommendations.map((rec, index) => (
          <Text key={index} style={styles.recommendation}>
            • {rec}
          </Text>
        ))}
      </Card.Content>
    </Card>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.messageImage} />
      )}
      
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
        
        {!item.isUser && item.suggestedProducts && item.suggestedProducts.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>🛍️ Suggested Products:</Text>
            {item.suggestedProducts.map(renderProductSuggestion)}
          </View>
        )}
        
        {!item.isUser && item.budget && (
          renderBudgetInfo(item.budget)
        )}
        
        {!item.isUser && item.totalCost && !item.budget && (
          <View style={styles.totalCostContainer}>
            <Text style={styles.totalCostText}>
              💰 Total Cost: ₹{item.totalCost.toLocaleString('en-IN')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Equipment Assistant</Text>
        <View style={styles.headerButtons}>
          <IconButton
            icon="refresh"
            iconColor="#007AFF"
            size={24}
            onPress={refreshChat}
          />
          <IconButton
            icon="close"
            iconColor="#FF3B30"
            size={24}
            onPress={clearChat}
          />
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(undefined)}
            >
              <MaterialIcons name="close" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputRow}>
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
              <MaterialIcons name="camera-alt" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about electrical equipment..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() && !selectedImage || isLoading}
          >
            <MaterialIcons
              name={isLoading ? 'hourglass-empty' : 'send'}
              size={24}
              color={(!inputText.trim() && !selectedImage) || isLoading ? '#999' : '#007AFF'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    backgroundColor: '#667eea',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  botMessage: {
    flexDirection: 'row',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 15,
    marginHorizontal: 5,
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
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#00796b',
  },
  botText: {
    color: '#2d3748',
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  suggestionsContainer: {
    marginTop: 8,
    paddingHorizontal: 5,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  productCard: {
    marginVertical: 4,
    elevation: 2,
  },
  productContent: {
    padding: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productManufacturer: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  productSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  specChip: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#e0e0e0',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#667eea',
  },
  budgetCard: {
    marginTop: 12,
    backgroundColor: '#f8f9fa',
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  budgetTotal: {
    fontSize: 18,
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
  budgetCategory: {
    fontSize: 14,
    color: '#333',
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  recommendations: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  recommendation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  totalCostContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  totalCostText: {
    fontSize: 16,
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
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  inputActions: {
    flexDirection: 'row',
    marginRight: 10,
  },
  actionButton: {
    padding: 8,
    marginRight: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    maxHeight: 100,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    padding: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  selectedImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
  },
});

export default SimpleChatInterface;