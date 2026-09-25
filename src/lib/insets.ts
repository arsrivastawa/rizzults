import type { EdgeInsets } from 'react-native-safe-area-context';

export const MIN_TOP_INSET = 20;
export const MIN_BOTTOM_INSET = 48; // Guarantees clearance over Android 3-button navigation bars

export function getSafeTopInset(insets: EdgeInsets, min: number = MIN_TOP_INSET): number {
  return Math.max(insets.top, min);
}

export function getSafeBottomInset(insets: EdgeInsets, min: number = MIN_BOTTOM_INSET): number {
  return Math.max(insets.bottom, min);
}
