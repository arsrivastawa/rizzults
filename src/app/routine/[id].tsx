import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';

import { Header } from '@/components/ui/header';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

export default function RoutineEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = Number(id);
  const routine = useWorkoutStore((s) => s.routines.find((r) => r.id === routineId));
  const addExerciseToRoutine = useWorkoutStore((s) => s.addExerciseToRoutine);
  const removeExerciseFromRoutine = useWorkoutStore((s) => s.removeExerciseFromRoutine);
  const moveExercise = useWorkoutStore((s) => s.moveExercise);
  const exercises = useWorkoutStore((s) => s.exercises);
  const startSession = useWorkoutStore((s) => s.startSession);
  const router = useRouter();

  const [showAdd, setShowAdd] = useState(false);

  const available = useMemo(() => {
    if (!routine) {
      return [];
    }
    const inRoutine = new Set(routine.exercises.map((re) => re.exerciseId));
    return exercises.filter((e) => !inRoutine.has(e.id));
  }, [routine, exercises]);

  if (!routine) {
    return (
      <>
        <Header title="Routine" />
        <View style={styles.empty}>
          <Text variant="heading" style={styles.emptyTitle}>
            Routine not found
          </Text>
        </View>
      </>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title={routine.name} />

      <FlatList
        data={routine.exercises}
        keyExtractor={(item) => item.exerciseId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const exercise = exercises.find((e) => e.id === item.exerciseId);
          const targets: string[] = [];
          if (item.targetSets != null) {
            targets.push(`${item.targetSets} sets`);
          }
          if (item.targetRepMin != null && item.targetRepMax != null) {
            targets.push(`${item.targetRepMin}–${item.targetRepMax} reps`);
          }
          return (
            <Row style={styles.exerciseRow}>
              <View style={styles.exerciseInfo}>
                <Text variant="heading" style={styles.exerciseName}>
                  {exercise?.name ?? 'Unknown exercise'}
                </Text>
                {targets.length > 0 ? <Text variant="label">{targets.join(', ')}</Text> : null}
              </View>
              <Pressable
                onPress={() => moveExercise(routine.id, index, index - 1)}
                disabled={index === 0}
                hitSlop={8}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons
                  name="chevron-up"
                  size={20}
                  color={index === 0 ? colors.border : colors.textSecondary}
                />
              </Pressable>
              <Pressable
                onPress={() => moveExercise(routine.id, index, index + 1)}
                disabled={index === routine.exercises.length - 1}
                hitSlop={8}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={
                    index === routine.exercises.length - 1 ? colors.border : colors.textSecondary
                  }
                />
              </Pressable>
              <Pressable
                onPress={() => removeExerciseFromRoutine(routine.id, item.exerciseId)}
                hitSlop={8}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="close" size={20} color={colors.danger} />
              </Pressable>
            </Row>
          );
        }}
        ListFooterComponent={
          <View style={styles.footer}>
            <Pressable
              onPress={() => setShowAdd(true)}
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <Ionicons name="add" size={20} color={colors.accent} />
              <Text color={colors.accent}>Add exercise</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                await startSession(routine.id);
                router.replace('/session/active');
              }}
              style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
              <Ionicons name="play" size={20} color={colors.background} />
              <Text variant="heading" style={styles.startLabel}>
                Start workout
              </Text>
            </Pressable>
          </View>
        }
      />

      <Modal
        visible={showAdd}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text variant="heading" style={styles.modalTitle}>
              Add exercise
            </Text>
            <Pressable onPress={() => setShowAdd(false)} hitSlop={8}>
              <Text color={colors.accent}>Done</Text>
            </Pressable>
          </View>
          <FlatList
            data={available}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => addExerciseToRoutine(routine.id, item.id)}
                style={({ pressed }) => pressed && styles.pressed}>
                <Row>
                  <Text variant="heading" style={styles.exerciseName}>
                    {item.name}
                  </Text>
                  <Text variant="label">
                    {item.primaryMuscles.split(',')[0]}
                    {item.equipment ? `, ${item.equipment}` : ''}
                  </Text>
                </Row>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text variant="label">All exercises are already in this routine.</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.body,
  },
  iconBtn: {
    width: 32,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 48,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  footer: {
    gap: spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    borderRadius: radius.card,
    backgroundColor: colors.accent,
  },
  startLabel: {
    fontSize: fontSize.body,
    color: colors.background,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.section,
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
