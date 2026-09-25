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
  category: string | null;
  equipment: string | null;
  primaryMuscles: string;
  secondaryMuscles: string;
  mechanic: string | null;
  force: string | null;
  instructions: string;
  trackingType: TrackingType;
  isCustom: boolean;
};

export type RoutineExercise = {
  exerciseId: string;
  position: number;
  targetSets: number | null;
  targetRepMin: number | null;
  targetRepMax: number | null;
  targetRir?: number | null;
  targetRestSeconds?: number | null;
};

export type Routine = {
  id: number;
  name: string;
  notes: string | null;
  exercises: RoutineExercise[];
};

export type SessionSetField = 'weight' | 'reps' | 'durationSeconds' | 'distance' | 'rir';

export type SessionSet = {
  id: number;
  exerciseId: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  durationSeconds: number | null;
  distance: number | null;
  rir: number | null;
  restSeconds?: number | null;
  loadBasis?: string;
  supersetGroup?: number | null;
  notes?: string | null;
  isWarmup: boolean;
  completed: boolean;
};

export type SessionExercise = {
  exerciseId: string;
  order: number;
  sets: SessionSet[];
};

export type Session = {
  id: number;
  routineName: string | null;
  bodyweight: number | null;
  dateLabel: string;
  startTime: string;
  durationSeconds: number | null;
  exercises: SessionExercise[];
};

export type ActiveSession = {
  id: number;
  routineId: number | null;
  routineName: string | null;
  bodyweight: number | null;
  startedAt: number;
  exercises: SessionExercise[];
};
