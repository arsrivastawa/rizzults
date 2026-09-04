import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { Header } from '@/components/ui/header';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import type { SessionExercise, SessionSet } from '@/data/mock';
import { formatDuration } from '@/lib/format';
import { trackingFields, type TrackingField } from '@/lib/tracking';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, spacing } from '@/theme/tokens';

function SetValue({ value, unit }: { value: number | null; unit: string }) {
  return (
    <View style={styles.cell}>
      <Text variant="numeral" style={styles.cellValue}>
        {value == null ? '—' : String(value)}
      </Text>
      <Text variant="label" style={styles.cellUnit}>
        {unit}
      </Text>
    </View>
  );
}

function SetLine({ index, fields, set }: { index: number; fields: TrackingField[]; set: SessionSet }) {
  return (
    <View style={styles.setLine}>
      <Text variant="numeral" style={styles.setIndex}>
        {index + 1}
      </Text>
      {fields.map((field) => (
        <SetValue key={field.key} value={set[field.key]} unit={field.unit} />
      ))}
    </View>
  );
}

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useWorkoutStore((s) => s.sessions.find((sess) => sess.id === id));
  const exercises = useWorkoutStore((s) => s.exercises);

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

  const renderExercise = ({ item }: { item: SessionExercise }) => {
    const exercise = exercises.find((e) => e.id === item.exerciseId);
    if (!exercise) {
      return null;
    }
    const fields = trackingFields[exercise.trackingType];
    return (
      <Row style={styles.exerciseCard}>
        <Text variant="heading" style={styles.exerciseName}>
          {exercise.name}
        </Text>
        <View style={styles.sets}>
          {item.sets.map((set, index) => (
            <SetLine key={set.id} index={index} fields={fields} set={set} />
          ))}
        </View>
      </Row>
    );
  };

  return (
    <View style={styles.screen}>
      <Header title={session.routineName} />
      <FlatList
        data={session.exercises}
        keyExtractor={(item) => item.exerciseId}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.meta}>
            <Text variant="label">
              {session.dateLabel}, {session.startTime}
            </Text>
            <Text variant="numeral" style={styles.duration}>
              {formatDuration(session.durationSeconds)}
            </Text>
          </View>
        }
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
