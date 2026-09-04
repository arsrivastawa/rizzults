import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExerciseSection } from '@/components/session/exercise-section';
import { Header } from '@/components/ui/header';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { formatDuration } from '@/lib/format';
import { formatNumber, toDisplayWeight, type Unit } from '@/lib/units';
import { trackingFields, type TrackingField } from '@/lib/tracking';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import type { SessionExercise } from '@/types';

function SetValue({ text, unit }: { text: string; unit: string }) {
  return (
    <View style={styles.cell}>
      <Text variant="numeral" style={styles.cellValue}>
        {text === '' ? '—' : text}
      </Text>
      <Text variant="label" style={styles.cellUnit}>
        {unit}
      </Text>
    </View>
  );
}

function SetLine({
  index,
  fields,
  set,
  unit,
}: {
  index: number;
  fields: TrackingField[];
  set: { weight: number | null; reps: number | null; durationSeconds: number | null; distance: number | null };
  unit: Unit;
}) {
  return (
    <View style={styles.setLine}>
      <Text variant="numeral" style={styles.setIndex}>
        {index + 1}
      </Text>
      {fields.map((field) => {
        const isWeight = field.key === 'weight';
        const value = set[field.key];
        const text =
          value == null ? '' : isWeight ? formatNumber(toDisplayWeight(value, unit)) : String(value);
        const unitLabel = isWeight ? unit : field.unit;
        return <SetValue key={field.key} text={text} unit={unitLabel} />;
      })}
    </View>
  );
}

export default function SessionDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessionId = Number(id);

  const session = useWorkoutStore((s) => s.sessions.find((sess) => sess.id === sessionId));
  const exercises = useWorkoutStore((s) => s.exercises);
  const unit = useWorkoutStore((s) => s.unit);
  const editSessionUpdateSet = useWorkoutStore((s) => s.editSessionUpdateSet);
  const editSessionRemoveSet = useWorkoutStore((s) => s.editSessionRemoveSet);
  const editSessionAddSet = useWorkoutStore((s) => s.editSessionAddSet);
  const deleteSession = useWorkoutStore((s) => s.deleteSession);

  const [editing, setEditing] = useState(false);

  if (!session) {
    return (
      <View style={styles.screen}>
        <Header title="Session" />
        <View style={styles.empty}>
          <Text variant="heading" style={styles.emptyTitle}>
            Session not found
          </Text>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete session', 'This workout and its sets will be removed permanently.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSession(session.id);
          router.back();
        },
      },
    ]);
  };

  const renderExercise = ({ item }: { item: SessionExercise }) => {
    const exercise = exercises.find((e) => e.id === item.exerciseId);
    if (!exercise) {
      return null;
    }
    if (editing) {
      return (
        <ExerciseSection
          exercise={exercise}
          sets={item.sets}
          onChangeSet={(setId, field, value) => editSessionUpdateSet(session.id, setId, field, value)}
          onRemoveSet={(setId) => editSessionRemoveSet(session.id, setId)}
          onAddSet={() => editSessionAddSet(session.id, item.exerciseId)}
        />
      );
    }
    const fields = trackingFields[exercise.trackingType];
    return (
      <Row style={styles.exerciseCard}>
        <Text variant="heading" style={styles.exerciseName}>
          {exercise.name}
        </Text>
        <View style={styles.sets}>
          {item.sets.map((set, index) => (
            <SetLine key={set.id} index={index} fields={fields} set={set} unit={unit} />
          ))}
        </View>
      </Row>
    );
  };

  return (
    <View style={styles.screen}>
      <Header
        title={session.routineName ?? 'Workout'}
        right={
          <Pressable onPress={() => setEditing((e) => !e)} hitSlop={12}>
            <Text color={colors.accent}>{editing ? 'Done' : 'Edit'}</Text>
          </Pressable>
        }
      />
      <FlatList
        data={session.exercises}
        keyExtractor={(item) => item.exerciseId}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.meta}>
            <Text variant="label">
              {session.dateLabel}, {session.startTime}
            </Text>
            <Text variant="numeral" style={styles.duration}>
              {formatDuration(session.durationSeconds ?? 0)}
            </Text>
          </View>
        }
        renderItem={renderExercise}
        ListFooterComponent={
          editing ? null : (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
              <Text color={colors.danger}>Delete session</Text>
            </Pressable>
          )
        }
      />
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
  meta: {
    marginBottom: spacing.sm,
  },
  duration: {
    fontSize: fontSize.title,
  },
  exerciseCard: {
    gap: spacing.md,
  },
  exerciseName: {
    fontSize: fontSize.body,
  },
  sets: {
    gap: spacing.sm,
  },
  setLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  setIndex: {
    width: 22,
    textAlign: 'center',
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  cellValue: {
    fontSize: fontSize.body,
  },
  cellUnit: {
    fontSize: fontSize.caption,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  pressed: {
    opacity: 0.7,
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
