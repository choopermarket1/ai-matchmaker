export const COLORS = {
  primary: '#FF6B6B',
  primaryDark: '#E85555',
  primaryLight: '#FF8E8E',
  secondary: '#4ECDC4',
  secondaryDark: '#3AB5AD',
  accent: '#FFE66D',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  text: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',
  border: '#DFE6E9',
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#E17055',
  heart: '#FF6B6B',
  male: '#74B9FF',
  female: '#FD79A8',
  remarriage: '#A29BFE',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
};

export const FONTS = {
  regular: 'System',
  bold: 'System',
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  padding: 16,
  radius: 12,
  cardRadius: 16,
};

import { Platform } from 'react-native';

export const SHADOWS = {
  small: Platform.select({
    web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  }) as any,
  medium: Platform.select({
    web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.15)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  }) as any,
};
