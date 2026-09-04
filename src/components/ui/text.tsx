import { Text as RNText, type TextProps } from 'react-native';

import { colors, fontSize, typography } from '@/theme/tokens';

type Variant = 'numeral' | 'heading' | 'body' | 'label';

type Props = TextProps & {
  variant?: Variant;
  color?: string;
};

const variantStyle = {
  numeral: typography.numeral,
  heading: typography.heading,
  body: typography.body,
  label: typography.label,
};

const defaultColor = {
  numeral: colors.textPrimary,
  heading: colors.textPrimary,
  body: colors.textPrimary,
  label: colors.textSecondary,
};

export function Text({ variant = 'body', color, style, ...rest }: Props) {
  return (
    <RNText
      style={[variantStyle[variant], { color: color ?? defaultColor[variant] }, style]}
      {...rest}
    />
  );
}

export { fontSize };
