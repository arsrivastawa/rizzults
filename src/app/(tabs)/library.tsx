import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { useWorkoutStore } from '@/store/workout';
import { fontSize, spacing } from '@/theme/tokens';

export default function LibraryScreen() {
  const exercises = useWorkoutStore((s) => s.exercises);

  return (
    <Screen title="Library">
      <View style={styles.list}>
        {exercises.map((exercise) => (
          <Row key={exercise.id}>
            <Text variant="heading" style={styles.name}>
              {exercise.name}
            </Text>
            <Text variant="label">
              {exercise.primaryMuscles}
              {exercise.equipment ? `, ${exercise.equipment}` : ''}
            </Text>
          </Row>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  name: {
    fontSize: fontSize.body,
  },
});
