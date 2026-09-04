import type { SQLiteDatabase } from 'expo-sqlite';

import { exerciseSeeds } from '@/db/exercises.seed';

type DemoRoutine = {
  name: string;
  exercises: {
    exerciseId: string;
    targetSets: number;
    targetRepMin: number | null;
    targetRepMax: number | null;
  }[];
};

const demoRoutines: DemoRoutine[] = [
  {
    name: 'Push Day',
    exercises: [
      { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', targetSets: 4, targetRepMin: 6, targetRepMax: 8 },
      { exerciseId: 'Standing_Military_Press', targetSets: 4, targetRepMin: 8, targetRepMax: 10 },
      { exerciseId: 'Dumbbell_Bicep_Curl', targetSets: 3, targetRepMin: 10, targetRepMax: 12 },
    ],
  },
  {
    name: 'Pull Day',
    exercises: [
      { exerciseId: 'Barbell_Deadlift', targetSets: 3, targetRepMin: 5, targetRepMax: 5 },
      { exerciseId: 'Pullups', targetSets: 4, targetRepMin: 8, targetRepMax: 12 },
      { exerciseId: 'Bent_Over_Barbell_Row', targetSets: 4, targetRepMin: 8, targetRepMax: 10 },
    ],
  },
  {
    name: 'Leg Day',
    exercises: [
      { exerciseId: 'Barbell_Squat', targetSets: 4, targetRepMin: 6, targetRepMax: 8 },
      { exerciseId: 'Leg_Press', targetSets: 4, targetRepMin: 10, targetRepMax: 12 },
      { exerciseId: 'Plank', targetSets: 3, targetRepMin: null, targetRepMax: null },
    ],
  },
];

export async function seedIfEmpty(db: SQLiteDatabase): Promise<void> {
  const countRow = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM exercises');
  if ((countRow?.count ?? 0) > 0) {
    return;
  }

  await db.withTransactionAsync(async () => {
    for (const e of exerciseSeeds) {
      await db.runAsync(
        `INSERT INTO exercises (id, name, category, equipment, primary_muscles, secondary_muscles, mechanic, force, instructions, tracking_type, is_custom)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        e.id,
        e.name,
        e.category,
        e.equipment,
        e.primaryMuscles,
        e.secondaryMuscles,
        e.mechanic,
        e.force,
        e.instructions,
        e.trackingType,
      );
    }

    for (const [i, routine] of demoRoutines.entries()) {
      const result = await db.runAsync(
        'INSERT INTO routines (name, notes, position) VALUES (?, ?, ?)',
        routine.name,
        null,
        i,
      );
      const routineId = result.lastInsertRowId;
      for (const [j, re] of routine.exercises.entries()) {
        await db.runAsync(
          `INSERT INTO routine_exercises (routine_id, exercise_id, position, target_sets, target_rep_min, target_rep_max)
           VALUES (?, ?, ?, ?, ?, ?)`,
          routineId,
          re.exerciseId,
          j,
          re.targetSets,
          re.targetRepMin,
          re.targetRepMax,
        );
      }
    }
  });
}
