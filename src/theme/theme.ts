import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6B73FF', // Calming purple
    secondary: '#9C88FF', // Light purple
    tertiary: '#FF6B9D', // Soft pink accent
    surface: '#FFFFFF',
    background: '#F8F9FF', // Very light purple background
    onSurface: '#1C1B1F',
    onBackground: '#1C1B1F',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  roundness: 12,
};