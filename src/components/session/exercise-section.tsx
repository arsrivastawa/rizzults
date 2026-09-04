import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { SetRow } from '@/components/session/set-row';
import { Text } from '@/components/ui/text';
import type { Exercise, SessionSet, SessionSetField } from '@/types';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

type Props = {
  exercise: Exercise;
  sets: SessionSet[];
  onChangeSet: (setId: number, field: SessionSetField, value: number | null) => void;
  onRemoveSet: (setId: number) => void;
  onAddSet: () => void;
};

export function ExerciseSection({ exercise, sets, onChangeSet, onRemoveSet, onAddSet }: Props) {
  return (
    <View style={styles.card}>
      <Text variant="heading" style={styles.name}>
        {exercise.name}
      </Text>
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
  name: {
    fontSize: fontSize.body,
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
