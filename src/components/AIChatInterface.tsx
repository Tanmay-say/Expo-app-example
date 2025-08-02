import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Card, FAB, useTheme, Text, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';

import { aiService, ChatMessage, AIResponse } from '../services/aiService';
import { Product } from '../types';

interface AIChatInterfaceProps {
  onProductSelect?: (product: Product) => void;
  onAddToCart?: (products: Product[], quantities?: { [key: string]: number }) => void;
  visible: boolean;
  onClose: () => void;
}

export default function AIChatInterface({ 
  onProductSelect, 
  onAddToCart, 
  visible, 
  onClose 
}: AIChatInterfaceProps) {
  const theme = useTheme();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (visible) {
      initializeChat();
    }
  }, [visible]);

  const initializeChat = () => {
    setMessages([
      {
        _id: 1,
        text: "👋 Hi! I'm your ElectroQuick AI Assistant! 🤖\n\nI can help you with:\n⚡ Product recommendations\n📱 Take photos of shopping lists\n💰 Cost calculations & budgets\n📋 Generate quotations\n🛠️ Technical support\n💳 Payment assistance\n\nHow can I help you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ElectroQuick AI',
          avatar: '🤖',
        },
        system: true,
      },
    ]);
  };

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const userMessage = newMessages[0];
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    setIsTyping(true);

    try {
      // Process with AI
      const aiResponse: AIResponse = await aiService.processTextQuery(userMessage.text);
      
      // Create AI response message
      const aiMessage: IMessage = {
        _id: Math.random().toString(),
        text: aiResponse.message,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ElectroQuick AI',
          avatar: '🤖',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [aiMessage]));

      // Handle suggested products
      if (aiResponse.suggestedProducts && aiResponse.suggestedProducts.length > 0) {
        setSuggestedProducts(aiResponse.suggestedProducts);
      }

      // Speak response (optional)
      if (aiResponse.message.length < 200) {
        Speech.speak(aiResponse.message, {
          language: 'en-IN',
          pitch: 1.1,
          rate: 0.9,
        });
      }

    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: IMessage = {
        _id: Math.random().toString(),
        text: "I apologize, but I'm having trouble right now. Please try again or contact our support team! 🛠️",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ElectroQuick AI',
          avatar: '🤖',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [errorMessage]));
    } finally {
      setIsTyping(false);
    }
  }, []);

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permission to take photos of shopping lists.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permission to take photos of shopping lists.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  const processImage = async (imageUri: string) => {
    setIsTyping(true);
    
    // Add user message with image
    const imageMessage: IMessage = {
      _id: Math.random().toString(),
      text: '📸 Analyzing shopping list...',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'You',
      },
      image: imageUri,
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, [imageMessage]));

    try {
      const aiResponse: AIResponse = await aiService.processImageQuery(
        imageUri, 
        'Please analyze this shopping list and help me find these electrical items with cost estimates.'
      );

      const aiMessage: IMessage = {
        _id: Math.random().toString(),
        text: aiResponse.message,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ElectroQuick AI',
          avatar: '🤖',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [aiMessage]));

      if (aiResponse.suggestedProducts) {
        setSuggestedProducts(aiResponse.suggestedProducts);
      }

    } catch (error) {
      console.error('Image processing error:', error);
      const errorMessage: IMessage = {
        _id: Math.random().toString(),
        text: "I couldn't analyze the image properly. Could you try again with a clearer photo or tell me what items you're looking for?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ElectroQuick AI',
          avatar: '🤖',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [errorMessage]));
    } finally {
      setIsTyping(false);
    }
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.colors.primary,
          },
          left: {
            backgroundColor: theme.colors.surfaceVariant,
          },
        }}
        textStyle={{
          right: {
            color: 'white',
          },
          left: {
            color: theme.colors.onSurface,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          paddingHorizontal: 8,
        }}
        primaryStyle={{
          alignItems: 'center',
        }}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <MaterialIcons name="send" size={24} color={theme.colors.primary} />
        </View>
      </Send>
    );
  };

  const renderAccessory = () => {
    return (
      <View style={styles.accessoryContainer}>
        <TouchableOpacity style={styles.accessoryButton} onPress={handleCamera}>
          <MaterialIcons name="camera-alt" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.accessoryButton} onPress={handleImagePicker}>
          <MaterialIcons name="photo-library" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSuggestedProducts = () => {
    if (suggestedProducts.length === 0) return null;

    return (
      <View style={styles.suggestedContainer}>
        <Text variant="titleSmall" style={styles.suggestedTitle}>
          🎯 Suggested Products
        </Text>
        {suggestedProducts.slice(0, 3).map((product) => (
          <Card key={product.id} style={styles.productCard}>
            <Card.Content style={styles.productContent}>
              <Text variant="bodyMedium" style={styles.productName}>
                {product.name}
              </Text>
              <Text variant="bodySmall" style={styles.productPrice}>
                ₹{product.price.toFixed(2)}
              </Text>
              <View style={styles.productButtons}>
                <Button
                  mode="outlined"
                  onPress={() => onProductSelect?.(product)}
                  style={styles.productButton}
                >
                  View
                </Button>
                <Button
                  mode="contained"
                  onPress={() => onAddToCart?.([product])}
                  style={styles.productButton}
                >
                  Add to Cart
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text variant="headlineSmall" style={styles.headerTitle}>
          🤖 AI Assistant
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
            name: 'You',
          }}
          isTyping={isTyping}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderAccessory={renderAccessory}
          placeholder="Ask me anything about electrical equipment..."
          alwaysShowSend
          scrollToBottom
        />
      </View>

      {renderSuggestedProducts()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
    width: 40,
    height: 40,
  },
  accessoryContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
  },
  accessoryButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  suggestedContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
    maxHeight: 200,
  },
  suggestedTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  productCard: {
    marginBottom: 8,
    elevation: 2,
  },
  productContent: {
    padding: 12,
  },
  productName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    color: '#667eea',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  productButton: {
    flex: 1,
  },
});