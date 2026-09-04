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

export type SessionSet = {
  id: string;
  weight: number | null;
  reps: number | null;
  durationSeconds: number | null;
  distance: number | null;
};

export type SessionExercise = {
  exerciseId: string;
  sets: SessionSet[];
};

export type Session = {
  id: string;
  routineName: string;
  dateLabel: string;
  startTime: string;
  durationSeconds: number;
  exercises: SessionExercise[];
};

function seedSet(
  weight: number | null,
  reps: number | null,
  durationSeconds: number | null = null,
  distance: number | null = null,
): SessionSet {
  return { id: `seed-${Math.random().toString(36).slice(2, 8)}`, weight, reps, durationSeconds, distance };
}

export const initialSessions: Session[] = [
  {
    id: 'ss-001',
    routineName: 'Push Day',
    dateLabel: 'Yesterday',
    startTime: '6:42 AM',
    durationSeconds: 3120,
    exercises: [
      {
        exerciseId: 'ex-001',
        sets: [
          seedSet(60, 8),
          seedSet(60, 8),
          seedSet(65, 6),
          seedSet(65, 6),
        ],
      },
      {
        exerciseId: 'ex-005',
        sets: [seedSet(40, 10), seedSet(40, 10), seedSet(42.5, 8)],
      },
      {
        exerciseId: 'ex-009',
        sets: [seedSet(15, 12), seedSet(15, 10), seedSet(17.5, 8)],
      },
    ],
  },
  {
    id: 'ss-002',
    routineName: 'Pull Day',
    dateLabel: 'Aug 31',
    startTime: '7:05 AM',
    durationSeconds: 3660,
    exercises: [
      {
        exerciseId: 'ex-003',
        sets: [seedSet(100, 5), seedSet(120, 5), seedSet(130, 5)],
      },
      {
        exerciseId: 'ex-004',
        sets: [seedSet(null, 8), seedSet(null, 8), seedSet(null, 10), seedSet(null, 7)],
      },
      {
        exerciseId: 'ex-006',
        sets: [seedSet(70, 8), seedSet(70, 8), seedSet(75, 6)],
      },
    ],
  },
  {
    id: 'ss-003',
    routineName: 'Leg Day',
    dateLabel: 'Aug 28',
    startTime: '6:15 AM',
    durationSeconds: 3480,
    exercises: [
      {
        exerciseId: 'ex-002',
        sets: [seedSet(80, 8), seedSet(90, 8), seedSet(95, 6), seedSet(95, 6)],
      },
      {
        exerciseId: 'ex-010',
        sets: [seedSet(160, 12), seedSet(180, 10), seedSet(180, 10)],
      },
      {
        exerciseId: 'ex-007',
        sets: [seedSet(null, null, 60), seedSet(null, null, 75), seedSet(null, null, 60)],
      },
    ],
  },
];

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}
