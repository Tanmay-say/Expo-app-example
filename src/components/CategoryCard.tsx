import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

const getCategoryIcon = (categoryId: string): keyof typeof MaterialIcons.glyphMap => {
  const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    'cables_wires': 'cable',
    'switch_protection': 'power',
    'circuit_breakers': 'electrical-services',
    'lighting': 'lightbulb',
    'transformers_motors': 'precision-manufacturing',
    'connectors': 'electrical-services',
    'relays_contactors': 'memory',
  };
  
  return iconMap[categoryId] || 'category';
};

const getCategoryGradient = (categoryId: string): string[] => {
  const gradientMap: Record<string, string[]> = {
    'cables_wires': ['#ff9a9e', '#fecfef'],
    'switch_protection': ['#667eea', '#764ba2'],
    'circuit_breakers': ['#f093fb', '#f5576c'],
    'lighting': ['#ffecd2', '#fcb69f'],
    'transformers_motors': ['#a8edea', '#fed6e3'],
    'connectors': ['#d299c2', '#fef9d7'],
    'relays_contactors': ['#89f7fe', '#66a6ff'],
  };
  
  return gradientMap[categoryId] || ['#667eea', '#764ba2'];
};

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const theme = useTheme();
  const gradientColors = getCategoryGradient(category.id);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content style={styles.content}>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={getCategoryIcon(category.id)}
                size={36}
                color="white"
              />
            </View>
            <Text variant="labelLarge" style={styles.title} numberOfLines={2}>
              {category.name}
            </Text>
          </Card.Content>
          
          {/* Decorative elements */}
          <View style={styles.decorativeElement1} />
          <View style={styles.decorativeElement2} />
        </LinearGradient>
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
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  decorativeElement1: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -10,
    right: -10,
  },
  decorativeElement2: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 10,
    left: 10,
  },
});