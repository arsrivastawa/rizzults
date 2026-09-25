import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { SetRow } from '@/components/session/set-row';
import { Text } from '@/components/ui/text';
import type { PreviousSet } from '@/db/repo';
import { trackingFields } from '@/lib/tracking';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import type { Exercise, SessionSet, SessionSetField } from '@/types';

type Props = {
  exercise: Exercise;
  sets: SessionSet[];
  previousSetsMap?: Record<number, PreviousSet>;
  onChangeSet: (setId: number, field: SessionSetField, value: number | null) => void;
  onRemoveSet: (setId: number) => void;
  onAddSet: () => void;
};

export function ExerciseSection({
  exercise,
  sets,
  previousSetsMap,
  onChangeSet,
  onRemoveSet,
  onAddSet,
}: Props) {
  const fields = trackingFields[exercise.trackingType];

  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <Text variant="heading" style={styles.name}>
          {exercise.name}
        </Text>
      </View>
      <View style={styles.columnHeaders}>
        <Text variant="label" style={styles.colIndex}>
          SET
        </Text>
        <Text variant="label" style={styles.colPrevious}>
          PREVIOUS
        </Text>
        {fields.map((field) => (
          <Text key={field.key} variant="label" style={styles.colInput}>
            {field.label.toUpperCase()}
          </Text>
        ))}
        <Text variant="label" style={styles.colRir}>
          RIR
        </Text>
        <View style={styles.colRemoveSpacer} />
      </View>
      <View style={styles.sets}>
        {sets.map((set, index) => (
          <SetRow
            key={set.id}
            index={index}
            trackingType={exercise.trackingType}
            set={set}
            previousSet={previousSetsMap?.[set.setNumber] ?? null}
            onChange={(field, value) => onChangeSet(set.id, field, value)}
            onRemove={() => onRemoveSet(set.id)}
          />
        ))}
      </View>
      <Pressable
        onPress={onAddSet}
        hitSlop={8}
        style={({ pressed }) => [styles.addSet, pressed && styles.pressed]}>
        <Ionicons name="add" size={18} color={colors.accent} />
        <Text color={colors.accent}>Add set</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    fontSize: fontSize.body,
    flexShrink: 1,
  },
  columnHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  colIndex: {
    width: 20,
    textAlign: 'center',
    fontSize: fontSize.caption,
  },
  colPrevious: {
    minWidth: 54,
    maxWidth: 84,
    textAlign: 'center',
    fontSize: fontSize.caption,
    paddingHorizontal: spacing.xs,
  },
  colInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.caption,
  },
  colRir: {
    width: 44,
    textAlign: 'center',
    fontSize: fontSize.caption,
  },
  colRemoveSpacer: {
    width: 32,
  },
  sets: {
    gap: spacing.sm,
  },
  addSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.7,
  },
});
