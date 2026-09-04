import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { colors, fontSize, spacing } from '@/theme/tokens';

type Props = PropsWithChildren<{
  title?: string;
  scroll?: boolean;
  headerRight?: ReactNode;
}>;

export function Screen({ title, scroll = true, headerRight, children }: Props) {
  const content = scroll ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scroll, styles.content]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {title ? (
        <View style={styles.headerRow}>
          <Text variant="heading" style={styles.title}>
            {title}
          </Text>
          {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
        </View>
      ) : null}
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.title,
  },
  headerRight: {
    marginLeft: spacing.md,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
