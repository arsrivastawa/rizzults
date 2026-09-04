import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import type { Unit } from '@/lib/units';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

const UNITS: Unit[] = ['kg', 'lb'];

export default function SettingsScreen() {
  const unit = useWorkoutStore((s) => s.unit);
  const setUnit = useWorkoutStore((s) => s.setUnit);

  return (
    <Screen title="Settings">
      <View style={styles.group}>
        <Text variant="label" style={styles.groupLabel}>
          Units
        </Text>
        <Row style={styles.unitRow}>
          <Text>Weight unit</Text>
          <View style={styles.segment}>
            {UNITS.map((u) => {
              const selected = unit === u;
              return (
                <Pressable
                  key={u}
                  onPress={() => setUnit(u)}
                  style={({ pressed }) => [
                    styles.segmentButton,
                    selected && styles.segmentSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text color={selected ? colors.accent : colors.textSecondary}>{u}</Text>
                </Pressable>
              );
            })}
          </View>
        </Row>
        <Text variant="label" style={styles.hint}>
          Weights are stored in kg and shown in the unit you pick.
        </Text>
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
  segment: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  segmentButton: {
    minWidth: 48,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    borderColor: colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
  hint: {
    fontSize: fontSize.caption,
    marginLeft: spacing.xs,
  },
});
