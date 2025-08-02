import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
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

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <MaterialIcons
              name={getCategoryIcon(category.id)}
              size={32}
              color="white"
            />
          </View>
          <Text variant="labelMedium" style={styles.title} numberOfLines={2}>
            {category.name}
          </Text>
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
  },
  content: {
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontWeight: '500',
  },
});