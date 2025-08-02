import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface GradientBannerProps {
  title: string;
  subtitle: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  colors?: string[];
}

export default function GradientBanner({ 
  title, 
  subtitle, 
  icon = 'bolt',
  colors = ['#667eea', '#764ba2', '#f093fb']
}: GradientBannerProps) {
  return (
    <LinearGradient colors={colors} style={styles.banner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.bannerContent}>
        <View style={styles.textContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={60} color="rgba(255, 255, 255, 0.8)" />
        </View>
      </View>
      
      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 20,
    padding: 24,
    margin: 16,
    position: 'relative',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  bannerContent: {
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
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  iconContainer: {
    marginLeft: 16,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -20,
    left: -20,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 20,
    left: 40,
  },
});