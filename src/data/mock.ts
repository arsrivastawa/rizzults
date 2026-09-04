export type TrackingType =
  | 'weight_reps'
  | 'bodyweight_reps'
  | 'time'
  | 'weight_time'
  | 'distance_time'
  | 'count';

export type Exercise = {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string;
  equipment: string | null;
  trackingType: TrackingType;
};

export type RoutineExercise = {
  exerciseId: string;
  targetSets: number;
  targetRepMin: number | null;
  targetRepMax: number | null;
};

export type Routine = {
  id: string;
  name: string;
  exercises: RoutineExercise[];
};

export const exercises: Exercise[] = [
  {
    id: 'ex-001',
    name: 'Barbell Bench Press',
    category: 'strength',
    primaryMuscles: 'Chest',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
  },
  {
    id: 'ex-002',
    name: 'Back Squat',
    category: 'strength',
    primaryMuscles: 'Quadriceps',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
  },
  {
    id: 'ex-003',
    name: 'Deadlift',
    category: 'strength',
    primaryMuscles: 'Lower back',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
  },
  {
    id: 'ex-004',
    name: 'Pull Up',
    category: 'strength',
    primaryMuscles: 'Lats',
    equipment: 'Bodyweight',
    trackingType: 'bodyweight_reps',
  },
  {
    id: 'ex-005',
    name: 'Overhead Press',
    category: 'strength',
    primaryMuscles: 'Shoulders',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
  },
  {
    id: 'ex-006',
    name: 'Barbell Row',
    category: 'strength',
    primaryMuscles: 'Middle back',
    equipment: 'Barbell',
    trackingType: 'weight_reps',
  },
  {
    id: 'ex-007',
    name: 'Plank',
    category: 'core',
    primaryMuscles: 'Abdominals',
    equipment: 'Bodyweight',
    trackingType: 'time',
  },
  {
    id: 'ex-008',
    name: 'Treadmill Run',
    category: 'cardio',
    primaryMuscles: 'Cardiovascular',
    equipment: 'Machine',
    trackingType: 'distance_time',
  },
  {
    id: 'ex-009',
    name: 'Dumbbell Curl',
    category: 'strength',
    primaryMuscles: 'Biceps',
    equipment: 'Dumbbell',
    trackingType: 'weight_reps',
  },
  {
    id: 'ex-010',
    name: 'Leg Press',
    category: 'strength',
    primaryMuscles: 'Quadriceps',
    equipment: 'Machine',
    trackingType: 'weight_reps',
  },
];

export const routines: Routine[] = [
  {
    id: 'rt-001',
    name: 'Push Day',
    exercises: [
      { exerciseId: 'ex-001', targetSets: 4, targetRepMin: 6, targetRepMax: 8 },
      { exerciseId: 'ex-005', targetSets: 4, targetRepMin: 8, targetRepMax: 10 },
      { exerciseId: 'ex-009', targetSets: 3, targetRepMin: 10, targetRepMax: 12 },
    ],
  },
  {
    id: 'rt-002',
    name: 'Pull Day',
    exercises: [
      { exerciseId: 'ex-003', targetSets: 3, targetRepMin: 5, targetRepMax: 5 },
      { exerciseId: 'ex-004', targetSets: 4, targetRepMin: 8, targetRepMax: 12 },
      { exerciseId: 'ex-006', targetSets: 4, targetRepMin: 8, targetRepMax: 10 },
    ],
  },
  {
    id: 'rt-003',
    name: 'Leg Day',
    exercises: [
      { exerciseId: 'ex-002', targetSets: 4, targetRepMin: 6, targetRepMax: 8 },
      { exerciseId: 'ex-010', targetSets: 4, targetRepMin: 10, targetRepMax: 12 },
      { exerciseId: 'ex-007', targetSets: 3, targetRepMin: null, targetRepMax: null },
    ],
  },
];

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}
