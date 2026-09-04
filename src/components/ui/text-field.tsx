import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

type Props = TextInputProps & { label: string };

export function TextField({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text variant="label" style={styles.label}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.accent}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.caption,
  },
  input: {
    minHeight: 44,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    paddingHorizontal: spacing.md,
  },
});
