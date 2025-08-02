import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  discount?: string;
  onPress?: () => void;
}

export default function PromoBanner({ title, subtitle, discount, onPress }: PromoBannerProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={['#ff6b6b', '#ee5a24', '#ff9ff3']}
        style={styles.banner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text variant="titleLarge" style={styles.title}>
              {title}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {subtitle}
            </Text>
            {discount && (
              <View style={styles.discountBadge}>
                <Text variant="labelSmall" style={styles.discountText}>
                  {discount}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.iconContainer}>
            <MaterialIcons name="local-offer" size={50} color="rgba(255, 255, 255, 0.9)" />
          </View>
        </View>
        
        {/* Animated elements */}
        <View style={styles.sparkle1}>
          <MaterialIcons name="auto-awesome" size={16} color="rgba(255, 255, 255, 0.7)" />
        </View>
        <View style={styles.sparkle2}>
          <MaterialIcons name="auto-awesome" size={12} color="rgba(255, 255, 255, 0.6)" />
        </View>
        <View style={styles.sparkle3}>
          <MaterialIcons name="auto-awesome" size={14} color="rgba(255, 255, 255, 0.8)" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  banner: {
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconContainer: {
    marginLeft: 16,
  },
  sparkle1: {
    position: 'absolute',
    top: 15,
    right: 80,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 20,
    left: 30,
  },
  sparkle3: {
    position: 'absolute',
    top: 40,
    left: 60,
  },
});