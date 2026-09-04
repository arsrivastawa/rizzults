import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { trackingFields } from '@/lib/tracking';
import { formatNumber, fromDisplayWeight, toDisplayWeight } from '@/lib/units';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, spacing } from '@/theme/tokens';
import type { SessionSet, SessionSetField, TrackingType } from '@/types';

type Props = {
  index: number;
  trackingType: TrackingType;
  set: SessionSet;
  onChange: (field: SessionSetField, value: number | null) => void;
  onRemove: () => void;
};

export function SetRow({ index, trackingType, set, onChange, onRemove }: Props) {
  const unit = useWorkoutStore((s) => s.unit);
  const fields = trackingFields[trackingType];

  return (
    <View style={styles.row}>
      <Text variant="numeral" style={styles.index}>
        {index + 1}
      </Text>
      {fields.map((field) => {
        const isWeight = field.key === 'weight';
        const displayValue =
          set[field.key] == null
            ? ''
            : isWeight
              ? formatNumber(toDisplayWeight(set[field.key] as number, unit))
              : String(set[field.key]);
        const unitLabel = isWeight ? unit : field.unit;
        return (
          <Input
            key={field.key}
            value={displayValue}
            onChangeText={(text) => {
              const normalized = text.trim().replace(',', '.');
              if (normalized === '') {
                onChange(field.key, null);
                return;
              }
              const parsed = Number(normalized);
              if (!Number.isFinite(parsed)) {
                onChange(field.key, null);
                return;
              }
              onChange(field.key, isWeight ? fromDisplayWeight(parsed, unit) : parsed);
            }}
            unit={unitLabel}
          />
        );
      })}
      <Pressable
        onPress={onRemove}
        hitSlop={12}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
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
