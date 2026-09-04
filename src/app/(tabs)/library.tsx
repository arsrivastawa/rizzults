import { FlatList, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { useWorkoutStore } from '@/store/workout';
import { fontSize, spacing } from '@/theme/tokens';
import type { Exercise } from '@/types';

export default function LibraryScreen() {
  const exercises = useWorkoutStore((s) => s.exercises);

  const renderItem = ({ item }: { item: Exercise }) => (
    <Row key={item.id}>
      <Text variant="heading" style={styles.name}>
        {item.name}
      </Text>
      <Text variant="label">
        {item.primaryMuscles.split(',')[0]}
        {item.equipment ? `, ${item.equipment}` : ''}
      </Text>
    </Row>
  );

  return (
    <Screen title="Library" scroll={false}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
