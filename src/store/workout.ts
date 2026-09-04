import { create } from 'zustand';

import {
  exercises,
  initialSessions,
  routines,
  type Exercise,
  type Routine,
  type Session,
  type SessionExercise,
  type SessionSet,
} from '@/data/mock';
import { formatTimeOfDay, uid } from '@/lib/format';

export type ActiveSession = {
  routineId: string;
  routineName: string;
  startedAt: number;
  exercises: SessionExercise[];
};

type WorkoutStore = {
  routines: Routine[];
  exercises: Exercise[];
  sessions: Session[];
  activeSession: ActiveSession | null;

  addExerciseToRoutine: (routineId: string, exerciseId: string) => void;
  removeExerciseFromRoutine: (routineId: string, exerciseId: string) => void;
  moveExercise: (routineId: string, from: number, to: number) => void;

  startSession: (routineId: string) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, field: keyof SessionSet, value: number | null) => void;
  finishSession: () => string | null;
  discardSession: () => void;
};

function emptySet(): SessionSet {
  return { id: uid(), weight: null, reps: null, durationSeconds: null, distance: null };
}

export const useWorkoutStore = create<WorkoutStore>()((set, get) => ({
  routines,
  exercises,
  sessions: initialSessions,
  activeSession: null,

  addExerciseToRoutine: (routineId, exerciseId) =>
    set((state) => ({
      routines: state.routines.map((routine) =>
        routine.id === routineId
          ? {
              ...routine,
              exercises: [
                ...routine.exercises,
                { exerciseId, targetSets: 3, targetRepMin: null, targetRepMax: null },
              ],
            }
          : routine,
      ),
    })),

  removeExerciseFromRoutine: (routineId, exerciseId) =>
    set((state) => ({
      routines: state.routines.map((routine) =>
        routine.id === routineId
          ? {
              ...routine,
              exercises: routine.exercises.filter((re) => re.exerciseId !== exerciseId),
            }
          : routine,
      ),
    })),

  moveExercise: (routineId, from, to) =>
    set((state) => ({
      routines: state.routines.map((routine) => {
        if (routine.id !== routineId) {
          return routine;
        }
        const next = [...routine.exercises];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return { ...routine, exercises: next };
      }),
    })),

  startSession: (routineId) =>
    set((state) => {
      const routine = state.routines.find((r) => r.id === routineId);
      if (!routine) {
        return {};
      }
      const sessionExercises: SessionExercise[] = routine.exercises.map((re) => ({
        exerciseId: re.exerciseId,
        sets: [emptySet()],
      }));
      return {
        activeSession: {
          routineId,
          routineName: routine.name,
          startedAt: Date.now(),
          exercises: sessionExercises,
        },
      };
    }),

  addSet: (exerciseId) =>
    set((state) => {
      const active = state.activeSession;
      if (!active) {
        return {};
      }
      return {
        activeSession: {
          ...active,
          exercises: active.exercises.map((se) =>
            se.exerciseId === exerciseId ? { ...se, sets: [...se.sets, emptySet()] } : se,
          ),
        },
      };
    }),

  removeSet: (exerciseId, setId) =>
    set((state) => {
      const active = state.activeSession;
      if (!active) {
        return {};
      }
      return {
        activeSession: {
          ...active,
          exercises: active.exercises.map((se) =>
            se.exerciseId === exerciseId
              ? { ...se, sets: se.sets.filter((s) => s.id !== setId) }
              : se,
          ),
        },
      };
    }),

  updateSet: (exerciseId, setId, field, value) =>
    set((state) => {
      const active = state.activeSession;
      if (!active) {
        return {};
      }
      return {
        activeSession: {
          ...active,
          exercises: active.exercises.map((se) =>
            se.exerciseId === exerciseId
              ? {
                  ...se,
                  sets: se.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
                }
              : se,
          ),
        },
      };
    }),

  finishSession: () => {
    const active = get().activeSession;
    if (!active) {
      return null;
    }
    const durationSeconds = Math.max(0, Math.round((Date.now() - active.startedAt) / 1000));
    const session: Session = {
      id: uid(),
      routineName: active.routineName,
      dateLabel: 'Today',
      startTime: formatTimeOfDay(active.startedAt),
      durationSeconds,
      exercises: active.exercises,
    };
    set({ sessions: [session, ...get().sessions], activeSession: null });
    return session.id;
  },

  discardSession: () => set({ activeSession: null }),
}));
