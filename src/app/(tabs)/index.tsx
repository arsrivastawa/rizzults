import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActiveSessionBar } from '@/components/session/active-session-bar';
import { Screen } from '@/components/ui/screen';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { useWorkoutStore } from '@/store/workout';
import { fontSize, spacing } from '@/theme/tokens';

export default function RoutinesScreen() {
  const router = useRouter();
  const routines = useWorkoutStore((s) => s.routines);

  return (
    <Screen title="Routines">
      <View style={styles.list}>
        <ActiveSessionBar />
        {routines.map((routine) => (
          <Row
            key={routine.id}
            onPress={() => router.push({ pathname: '/routine/[id]', params: { id: routine.id } })}>
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
