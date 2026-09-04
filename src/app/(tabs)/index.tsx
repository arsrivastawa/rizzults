import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { routines } from '@/data/mock';
import { fontSize, spacing } from '@/theme/tokens';

export default function RoutinesScreen() {
  return (
    <Screen title="Routines">
      <View style={styles.list}>
        {routines.map((routine) => (
          <Row key={routine.id}>
            <Text variant="heading" style={styles.name}>
              {routine.name}
            </Text>
            <Text variant="label">
              {routine.exercises.length} {routine.exercises.length === 1 ? 'exercise' : 'exercises'}
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
    fontSize: fontSize.section,
  },
});
