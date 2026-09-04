import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AddExerciseModal } from '@/components/library/add-exercise-modal';
import { Screen } from '@/components/ui/screen';
import { SearchBar } from '@/components/ui/search-bar';
import { Row } from '@/components/ui/row';
import { Text } from '@/components/ui/text';
import { filterByName } from '@/lib/search';
import { useWorkoutStore } from '@/store/workout';
import { colors, fontSize, spacing } from '@/theme/tokens';
import type { Exercise } from '@/types';

export default function LibraryScreen() {
  const exercises = useWorkoutStore((s) => s.exercises);
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => filterByName(exercises, query), [exercises, query]);

  const renderItem = ({ item }: { item: Exercise }) => {
    const isCustom = item.isCustom ? 'Custom' : null;
    const label = [item.primaryMuscles.split(',')[0], item.equipment ?? isCustom]
      .filter(Boolean)
      .join(', ');
    return (
      <Row key={item.id}>
        <Text variant="heading" style={styles.name}>
          {item.name}
        </Text>
        <Text variant="label">{label}</Text>
      </Row>
    );
  };

  return (
    <Screen
      title="Library"
      scroll={false}
      headerRight={
        <Pressable onPress={() => setShowAdd(true)} hitSlop={12} style={({ pressed }) => pressed && styles.pressed}>
          <Ionicons name="add" size={26} color={colors.accent} />
        </Pressable>
      }>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text variant="label" style={styles.empty}>
            No exercises match your search.
          </Text>
        }
      />
      <AddExerciseModal visible={showAdd} onClose={() => setShowAdd(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  name: {
    fontSize: fontSize.body,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  pressed: {
    opacity: 0.7,
  },
});
