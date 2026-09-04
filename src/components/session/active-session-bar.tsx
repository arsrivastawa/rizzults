import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useElapsedTime } from '@/hooks/use-elapsed-time';
import { formatClock } from '@/lib/format';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

export function ActiveSessionBar() {
  const router = useRouter();
  const activeSession = useWorkoutStore((s) => s.activeSession);
  const elapsed = useElapsedTime(activeSession?.startedAt ?? null);

  if (!activeSession) {
    return null;
  }

  return (
    <Pressable
      onPress={() => router.push('/session/active')}
      style={({ pressed }) => [styles.bar, pressed && styles.pressed]}>
      <View style={styles.info}>
        <Text variant="label">Workout in progress</Text>
        <Text variant="heading" style={styles.name}>
          {activeSession.routineName ?? 'Workout'}
        </Text>
      </View>
      <View style={styles.timer}>
        <Text variant="numeral" style={styles.timerText}>
          {formatClock(elapsed)}
        </Text>
        <Text color={colors.accent}>Resume</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.body,
  },
  timer: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  timerText: {
    fontSize: fontSize.section,
    color: colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
});
