import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { SetRow } from '@/components/session/set-row';
import { Text } from '@/components/ui/text';
import type { LastSet } from '@/db/repo';
import { formatSetSummary } from '@/lib/units';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import type { Exercise, SessionSet, SessionSetField } from '@/types';

type Props = {
  exercise: Exercise;
  sets: SessionSet[];
  last?: LastSet | null;
  onChangeSet: (setId: number, field: SessionSetField, value: number | null) => void;
  onRemoveSet: (setId: number) => void;
  onAddSet: () => void;
};

export function ExerciseSection({ exercise, sets, last, onChangeSet, onRemoveSet, onAddSet }: Props) {
  const unit = useWorkoutStore((s) => s.unit);
  const summary = last ? formatSetSummary(exercise.trackingType, last, unit) : '';

  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <Text variant="heading" style={styles.name}>
          {exercise.name}
        </Text>
        {summary ? (
          <Text variant="label" style={styles.last}>
            Last: {summary}
          </Text>
        ) : null}
      </View>
      <View style={styles.sets}>
        {sets.map((set, index) => (
          <SetRow
            key={set.id}
            index={index}
            trackingType={exercise.trackingType}
            set={set}
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
  last: {
    flexShrink: 0,
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
