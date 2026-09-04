import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import type { SessionSet, TrackingType } from '@/data/mock';
import { trackingFields } from '@/lib/tracking';
import { colors, fontSize, spacing } from '@/theme/tokens';

type Props = {
  index: number;
  trackingType: TrackingType;
  set: SessionSet;
  onChange: (field: keyof SessionSet, value: number | null) => void;
  onRemove: () => void;
};

export function SetRow({ index, trackingType, set, onChange, onRemove }: Props) {
  const fields = trackingFields[trackingType];

  return (
    <View style={styles.row}>
      <Text variant="numeral" style={styles.index}>
        {index + 1}
      </Text>
      {fields.map((field) => (
        <Input
          key={field.key}
          value={set[field.key] == null ? '' : String(set[field.key])}
          onChangeText={(text) => {
            const normalized = text.trim().replace(',', '.');
            const parsed = normalized === '' ? null : Number(normalized);
            onChange(field.key, Number.isFinite(parsed) ? parsed : null);
          }}
          unit={field.unit}
        />
      ))}
      <Pressable onPress={onRemove} hitSlop={12} style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
        <Ionicons name="close" size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  index: {
    width: 22,
    textAlign: 'center',
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  remove: {
    width: 32,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
