import type { TextStyle } from 'react-native';

export const colors = {
  background: '#0B0B0D',
  surface: '#18181B',
  surfaceElevated: '#212124',
  border: '#2A2A2E',
  textPrimary: '#EDEDED',
  textSecondary: '#8E8E93',
  accent: '#4C8DFF',
  danger: '#E5484D',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  card: 14,
  pill: 999,
} as const;

export const typography: Record<'numeral' | 'heading' | 'body' | 'label', TextStyle> = {
  numeral: { fontFamily: 'Inter_800ExtraBold', fontVariant: ['tabular-nums'] },
  heading: { fontFamily: 'Inter_700Bold' },
  body: { fontFamily: 'Inter_400Regular' },
  label: { fontFamily: 'Inter_500Medium', color: colors.textSecondary },
};

export const fontSize = {
  caption: 13,
  label: 15,
  body: 17,
  section: 20,
  title: 28,
  numeral: 20,
} as const;
