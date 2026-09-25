import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExerciseSection } from '@/components/session/exercise-section';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useElapsedTime } from '@/hooks/use-elapsed-time';
import { formatClock } from '@/lib/format';
import { getSafeBottomInset, getSafeTopInset } from '@/lib/insets';
import { formatNumber, fromDisplayWeight, isEmptySet, toDisplayWeight } from '@/lib/units';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import type { SessionExercise } from '@/types';

export default function ActiveSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topInset = getSafeTopInset(insets);
  const bottomInset = getSafeBottomInset(insets);

  const activeSession = useWorkoutStore((s) => s.activeSession);
  const unit = useWorkoutStore((s) => s.unit);
  const exercises = useWorkoutStore((s) => s.exercises);
  const previousSets = useWorkoutStore((s) => s.previousSets);
  const addSet = useWorkoutStore((s) => s.addSet);
  const removeSet = useWorkoutStore((s) => s.removeSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const updateBodyweight = useWorkoutStore((s) => s.updateBodyweight);
  const finishSession = useWorkoutStore((s) => s.finishSession);

  const elapsed = useElapsedTime(activeSession?.startedAt ?? null);
  const hasCompleted =
    activeSession?.exercises.some((e) => e.sets.some((s) => !isEmptySet(s))) ?? false;

  if (!activeSession) {
    return (
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: topInset + spacing.sm }]}>
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

  const renderExercise = (item: SessionExercise) => {
    const exercise = exercises.find((e) => e.id === item.exerciseId);
    if (!exercise) {
      return null;
    }
    return (
      <ExerciseSection
        exercise={exercise}
        sets={item.sets}
        previousSetsMap={previousSets[item.exerciseId]}
        onChangeSet={(setId, field, value) => updateSet(setId, field, value)}
        onRemoveSet={(setId) => removeSet(setId)}
        onAddSet={() => addSet(item.exerciseId)}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: topInset + spacing.sm }]}>
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

      <KeyboardAwareScrollView
        contentContainerStyle={[styles.list, { paddingBottom: bottomInset + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={bottomInset + spacing.xl}>
        <View style={styles.bodyweightRow}>
          <View style={styles.bodyweightLabelGroup}>
            <Ionicons name="scale-outline" size={16} color={colors.textSecondary} />
            <Text variant="label" style={styles.bodyweightLabel}>
              Bodyweight
            </Text>
          </View>
          <View style={styles.bodyweightInputWrapper}>
            <Input
              value={
                activeSession.bodyweight != null
                  ? formatNumber(toDisplayWeight(activeSession.bodyweight, unit))
                  : ''
              }
              onChangeText={(text) => {
                const normalized = text.trim().replace(',', '.');
                if (normalized === '') {
                  updateBodyweight(null);
                  return;
                }
                const parsed = Number(normalized);
                if (!Number.isFinite(parsed) || parsed <= 0) {
                  updateBodyweight(null);
                  return;
                }
                updateBodyweight(fromDisplayWeight(parsed, unit));
              }}
              placeholder="Optional"
              unit={unit}
            />
          </View>
        </View>

        {activeSession.exercises.map((item) => (
          <View key={item.exerciseId}>{renderExercise(item)}</View>
        ))}
      </KeyboardAwareScrollView>
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
  bodyweightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  bodyweightLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bodyweightLabel: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  bodyweightInputWrapper: {
    width: 100,
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
