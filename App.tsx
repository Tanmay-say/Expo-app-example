import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#667eea',
    primaryContainer: '#f093fb',
    secondary: '#764ba2',
    secondaryContainer: '#f093fb',
    tertiary: '#ff6b6b',
    tertiaryContainer: '#ffeaa7',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    error: '#ff6b6b',
    warning: '#fdcb6e',
    success: '#00b894',
    info: '#74b9ff',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#2d3748',
    onBackground: '#2d3748',
    outline: '#e2e8f0',
    shadow: 'rgba(102, 126, 234, 0.25)',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <AppNavigator />
    </PaperProvider>
  );
}