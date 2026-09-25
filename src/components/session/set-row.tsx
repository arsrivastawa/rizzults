import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import type { PreviousSet } from '@/db/repo';
import { trackingFields } from '@/lib/tracking';
import { formatNumber, formatPreviousSet, fromDisplayWeight, toDisplayWeight } from '@/lib/units';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, spacing } from '@/theme/tokens';
import type { SessionSet, SessionSetField, TrackingType } from '@/types';

type Props = {
  index: number;
  trackingType: TrackingType;
  set: SessionSet;
  previousSet?: PreviousSet | null;
  onChange: (field: SessionSetField, value: number | null) => void;
  onRemove: () => void;
};

export function SetRow({ index, trackingType, set, previousSet, onChange, onRemove }: Props) {
  const unit = useWorkoutStore((s) => s.unit);
  const fields = trackingFields[trackingType];
  const prevText = formatPreviousSet(trackingType, previousSet, unit);

  return (
    <View style={styles.row}>
      <Text variant="numeral" style={styles.index}>
        {index + 1}
      </Text>
      <View style={styles.previousCell}>
        <Text variant="label" style={styles.previousText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
          {prevText}
        </Text>
      </View>
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
  previousCell: {
    minWidth: 60,
    maxWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  previousText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
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
