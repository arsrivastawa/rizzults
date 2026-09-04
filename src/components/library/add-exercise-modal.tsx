import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import type { TrackingType } from '@/types';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const TRACKING_OPTIONS: { value: TrackingType; label: string }[] = [
  { value: 'weight_reps', label: 'Weight + Reps' },
  { value: 'bodyweight_reps', label: 'Reps (bodyweight)' },
  { value: 'time', label: 'Time' },
  { value: 'weight_time', label: 'Weight + Time' },
  { value: 'distance_time', label: 'Distance + Time' },
  { value: 'count', label: 'Count' },
];

export function AddExerciseModal({ visible, onClose }: Props) {
  const createCustomExercise = useWorkoutStore((s) => s.createCustomExercise);
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [trackingType, setTrackingType] = useState<TrackingType>('weight_reps');

  const canSave = name.trim().length > 0;

  const handleClose = () => {
    setName('');
    setMuscle('');
    setEquipment('');
    setTrackingType('weight_reps');
    onClose();
  };

  const handleSave = async () => {
    if (!canSave) {
      return;
    }
    await createCustomExercise({
      name: name.trim(),
      category: 'custom',
      equipment: equipment.trim() || null,
      primaryMuscles: muscle.trim() || 'Custom',
      secondaryMuscles: '',
      instructions: '',
      trackingType,
    });
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Pressable onPress={handleClose} hitSlop={8}>
            <Text variant="label">Cancel</Text>
          </Pressable>
          <Text variant="heading" style={styles.title}>
            Add exercise
          </Text>
          <Pressable onPress={handleSave} disabled={!canSave} hitSlop={8}>
            <Text color={canSave ? colors.accent : colors.textSecondary}>Save</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <TextField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Cable Lateral Raise"
            autoFocus
          />

          <View style={styles.field}>
            <Text variant="label" style={styles.fieldLabel}>
              How it&apos;s tracked
            </Text>
            <View style={styles.options}>
              {TRACKING_OPTIONS.map((option) => {
                const selected = option.value === trackingType;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setTrackingType(option.value)}
                    style={({ pressed }) => [
                      styles.option,
                      selected && styles.optionSelected,
                      pressed && styles.pressed,
                    ]}>
                    <Text color={selected ? colors.accent : colors.textSecondary}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <TextField label="Primary muscles" value={muscle} onChangeText={setMuscle} placeholder="e.g. Shoulders" />
          <TextField label="Equipment (optional)" value={equipment} onChangeText={setEquipment} placeholder="e.g. Cable" />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.section,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontSize: fontSize.caption,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
});
