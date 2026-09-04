import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ActiveSessionBar } from '@/components/session/active-session-bar';
import { Screen } from '@/components/ui/screen';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, spacing } from '@/theme/tokens';

export default function RoutinesScreen() {
  const router = useRouter();
  const routines = useWorkoutStore((s) => s.routines);
  const createRoutine = useWorkoutStore((s) => s.createRoutine);

  const handleCreate = async () => {
    const routineId = await createRoutine();
    router.push({ pathname: '/routine/[id]', params: { id: String(routineId) } });
  };

  return (
    <Screen
      title="Routines"
      headerRight={
        <Pressable onPress={handleCreate} hitSlop={12} style={({ pressed }) => pressed && styles.pressed}>
          <Ionicons name="add" size={26} color={colors.accent} />
        </Pressable>
      }>
      <View style={styles.list}>
        <ActiveSessionBar />
        {routines.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="label" style={styles.emptyText}>
              Add your first routine
            </Text>
          </View>
        ) : (
          routines.map((routine) => (
            <Row
              key={routine.id}
              onPress={() =>
                router.push({ pathname: '/routine/[id]', params: { id: String(routine.id) } })
              }>
              <Text variant="heading" style={styles.name}>
                {routine.name}
              </Text>
              <Text variant="label">
                {routine.exercises.length}{' '}
                {routine.exercises.length === 1 ? 'exercise' : 'exercises'}
              </Text>
            </Row>
          ))
        )}
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
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
