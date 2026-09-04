import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExerciseSection } from '@/components/session/exercise-section';
import { Text } from '@/components/ui/text';
import type { SessionExercise } from '@/types';
import { useElapsedTime } from '@/hooks/use-elapsed-time';
import { formatClock } from '@/lib/format';
import { isEmptySet } from '@/lib/units';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, spacing } from '@/theme/tokens';

export default function ActiveSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeSession = useWorkoutStore((s) => s.activeSession);
  const exercises = useWorkoutStore((s) => s.exercises);
  const lastSets = useWorkoutStore((s) => s.lastSets);
  const addSet = useWorkoutStore((s) => s.addSet);
  const removeSet = useWorkoutStore((s) => s.removeSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const finishSession = useWorkoutStore((s) => s.finishSession);

  const elapsed = useElapsedTime(activeSession?.startedAt ?? null);
  const hasCompleted =
    activeSession?.exercises.some((e) => e.sets.some((s) => !isEmptySet(s))) ?? false;

  if (!activeSession) {
    return (
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.empty}>
          <Text variant="heading" style={styles.emptyTitle}>
            No active workout
          </Text>
        </View>
      </View>
    );
  }

  const handleFinish = async () => {
    const sessionId = await finishSession();
    if (sessionId != null) {
      router.replace({ pathname: '/session/[id]', params: { id: String(sessionId) } });
    }
  };

  const renderExercise = ({ item }: { item: SessionExercise }) => {
    const exercise = exercises.find((e) => e.id === item.exerciseId);
    if (!exercise) {
      return null;
    }
    return (
      <ExerciseSection
        exercise={exercise}
        sets={item.sets}
        last={lastSets[item.exerciseId] ?? null}
        onChangeSet={(setId, field, value) => updateSet(setId, field, value)}
        onRemoveSet={(setId) => removeSet(setId)}
        onAddSet={() => addSet(item.exerciseId)}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text variant="heading" style={styles.headerTitle} numberOfLines={1}>
            {activeSession.routineName ?? 'Workout'}
          </Text>
          <Text variant="numeral" style={styles.timer}>
            {formatClock(elapsed)}
          </Text>
        </View>
        <Pressable
          onPress={handleFinish}
          disabled={!hasCompleted}
          hitSlop={12}
          style={({ pressed }) => pressed && styles.pressed}>
          <Text color={hasCompleted ? colors.accent : colors.textSecondary}>Finish</Text>
        </Pressable>
      </View>

      <FlatList
        data={activeSession.exercises}
        keyExtractor={(item) => item.exerciseId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderExercise}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  back: {
    width: 40,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.label,
  },
  timer: {
    fontSize: fontSize.section,
    color: colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.section,
  },
});
