import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { fontSize, spacing } from '@/theme/tokens';

export default function SettingsScreen() {
  return (
    <Screen title="Settings">
      <View style={styles.group}>
        <Text variant="label" style={styles.groupLabel}>
          Units
        </Text>
        <Row style={styles.unitRow}>
          <Text>Weight unit</Text>
          <Text variant="label">kg</Text>
        </Row>
      </View>

      <View style={styles.group}>
        <Text variant="label" style={styles.groupLabel}>
          Data
        </Text>
        <Row>
          <Text>Export data as CSV</Text>
        </Row>
        <Row>
          <Text>Backup database</Text>
        </Row>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  groupLabel: {
    fontSize: fontSize.caption,
    marginLeft: spacing.xs,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
