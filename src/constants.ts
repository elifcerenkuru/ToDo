// Constants and configuration

import { MD3DarkTheme } from 'react-native-paper';
import { Category } from './types';

export const THEME = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    background: '#0F0F1E',
    surface: '#1A1A2E',
    card: '#16213E',
  },
};

export const CATEGORIES: Category[] = [
  { value: 'personal', label: 'Personal', color: '#9C27B0', gradient: ['#9C27B0', '#E91E63'] as const },
  { value: 'work', label: 'Work', color: '#2196F3', gradient: ['#2196F3', '#00BCD4'] as const },
  { value: 'shopping', label: 'Shopping', color: '#FF9800', gradient: ['#FF9800', '#FF5722'] as const },
  { value: 'health', label: 'Health', color: '#4CAF50', gradient: ['#4CAF50', '#8BC34A'] as const },
  { value: 'other', label: 'Other', color: '#607D8B', gradient: ['#607D8B', '#90A4AE'] as const },
];

export const COLORS = {
  GRADIENT_PRIMARY: ['#8B5CF6', '#06B6D4'] as const,
  GRADIENT_TODO_BG: ['rgba(139, 92, 246, 0.1)', 'rgba(6, 182, 212, 0.05)'] as const,
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#9CA3AF',
  TEXT_PLACEHOLDER: '#6B7280',
  BORDER: '#374151',
  ERROR: '#EF4444',
  BACKGROUND_DARK: '#0F0F1E',
  BACKGROUND_CARD: '#1A1A2E',
};

