import { useState } from 'react';
import { StyleSheet, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { Text } from '@/components/ui/text';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  unit: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
};

export function Input({
  value,
  onChangeText,
  unit,
  placeholder = '0',
  keyboardType = 'decimal-pad',
}: Props) {
  const [text, setText] = useState(value);

  return (
    <View style={styles.field}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={(next) => {
          setText(next);
          onChangeText(next);
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        selectionColor={colors.accent}
      />
      <Text variant="label" style={styles.unit}>
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  input: {
    alignSelf: 'stretch',
    minHeight: 44,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    color: colors.textPrimary,
    fontFamily: 'Inter_800ExtraBold',
    fontSize: fontSize.body,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
  unit: {
    fontSize: fontSize.caption,
  },
});
