import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import type { PreviousSet } from '@/db/repo';
import { trackingFields } from '@/lib/tracking';
import { formatNumber, formatPreviousSet, fromDisplayWeight, toDisplayWeight } from '@/lib/units';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import type { SessionSet, SessionSetField, TrackingType } from '@/types';

type Props = {
  index: number;
  trackingType: TrackingType;
  set: SessionSet;
  previousSet?: PreviousSet | null;
  onChange: (field: SessionSetField, value: number | null) => void;
  onRemove: () => void;
};

const RIR_OPTIONS: { label: string; value: number | null }[] = [
  { label: '-', value: null },
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4+', value: 4 },
];

export function SetRow({ index, trackingType, set, previousSet, onChange, onRemove }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const unit = useWorkoutStore((s) => s.unit);
  const fields = trackingFields[trackingType];
  const prevText = formatPreviousSet(trackingType, previousSet, unit);

  const rirDisplay = set.rir == null ? '-' : set.rir >= 4 ? '4+' : String(set.rir);

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
        onPress={() => setPickerOpen(true)}
        hitSlop={6}
        style={({ pressed }) => [styles.rirTouchArea, pressed && styles.pressed]}>
        <View style={[styles.rirChip, set.rir != null && styles.rirChipSelected]}>
          <Text style={[styles.rirText, set.rir != null && styles.rirTextSelected]}>
            {rirDisplay}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={onRemove}
        hitSlop={12}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
        <Ionicons name="close" size={18} color={colors.textSecondary} />
      </Pressable>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(false)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Text variant="heading" style={styles.modalTitle}>
              Reps In Reserve (RIR)
            </Text>
            <Text variant="label" style={styles.modalSubtitle}>
              How many more reps could you have done?
            </Text>
            <View style={styles.optionsRow}>
              {RIR_OPTIONS.map((opt) => {
                const isSelected = opt.value === null ? set.rir == null : set.rir === opt.value;
                return (
                  <Pressable
                    key={opt.label}
                    style={({ pressed }) => [
                      styles.optionChip,
                      isSelected && styles.optionChipSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => {
                      onChange('rir', opt.value);
                      setPickerOpen(false);
                    }}>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
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
    width: 20,
    textAlign: 'center',
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  previousCell: {
    minWidth: 54,
    maxWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  previousText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rirTouchArea: {
    width: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rirChip: {
    width: 36,
    height: 30,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rirChipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceElevated,
  },
  rirText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  rirTextSelected: {
    color: colors.accent,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalTitle: {
    fontSize: fontSize.body,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  optionChip: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionChipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  optionText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: '#000000',
  },
});
