import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { fontSize, spacing } from '@/theme/tokens';

export default function HistoryScreen() {
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

const styles = StyleSheet.create({
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
