import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { formatDuration } from '@/lib/format';
import { useWorkoutStore } from '@/store/workout';
import { fontSize, spacing } from '@/theme/tokens';

export default function HistoryScreen() {
  const router = useRouter();
  const sessions = useWorkoutStore((s) => s.sessions);

  if (sessions.length === 0) {
    return (
      <Screen title="History" scroll={false}>
        <View style={styles.empty}>
          <Text variant="heading" style={styles.emptyTitle}>
            Log your first workout
          </Text>
          <Text variant="label" style={styles.emptyBody}>
            Finished sessions will show up here.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="History">
      <View style={styles.list}>
        {sessions.map((session) => (
          <Row
            key={session.id}
            onPress={() =>
              router.push({ pathname: '/session/[id]', params: { id: session.id } })
            }>
            <View style={styles.rowTop}>
              <Text variant="heading" style={styles.name}>
                {session.routineName}
              </Text>
              <Text variant="numeral" style={styles.duration}>
                {formatDuration(session.durationSeconds)}
              </Text>
            </View>
            <Text variant="label">
              {session.dateLabel}, {session.startTime}
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
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: fontSize.body,
  },
  duration: {
    fontSize: fontSize.body,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.section,
    textAlign: 'center',
  },
  emptyBody: {
    textAlign: 'center',
  },
});
