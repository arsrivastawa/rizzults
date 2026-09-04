import { create } from 'zustand';

import { initDatabase } from '@/db/database';
import * as repo from '@/db/repo';
import type { ActiveSession, Exercise, Routine, Session, SessionSetField } from '@/types';

type WorkoutStore = {
  hydrated: boolean;
  exercises: Exercise[];
  routines: Routine[];
  sessions: Session[];
  activeSession: ActiveSession | null;

  hydrate: () => Promise<void>;

  addExerciseToRoutine: (routineId: number, exerciseId: string) => Promise<void>;
  removeExerciseFromRoutine: (routineId: number, exerciseId: string) => Promise<void>;
  moveExercise: (routineId: number, from: number, to: number) => Promise<void>;

  startSession: (routineId: number) => Promise<void>;
  addSet: (exerciseId: string) => Promise<void>;
  removeSet: (setId: number) => Promise<void>;
  updateSet: (setId: number, field: SessionSetField, value: number | null) => Promise<void>;
  finishSession: () => Promise<number | null>;
};

export const useWorkoutStore = create<WorkoutStore>()((set, get) => ({
  hydrated: false,
  exercises: [],
  routines: [],
  sessions: [],
  activeSession: null,

  hydrate: async () => {
    if (get().hydrated) {
      return;
    }
    await initDatabase();
    const [exercises, routines, sessions, activeSession] = await Promise.all([
      repo.listExercises(),
      repo.listRoutines(),
      repo.listSessions(),
      repo.getActiveSession(),
    ]);
    set({ exercises, routines, sessions, activeSession, hydrated: true });
  },

  addExerciseToRoutine: async (routineId, exerciseId) => {
    await repo.addRoutineExercise(routineId, exerciseId);
    set({ routines: await repo.listRoutines() });
  },

  removeExerciseFromRoutine: async (routineId, exerciseId) => {
    await repo.removeRoutineExercise(routineId, exerciseId);
    set({ routines: await repo.listRoutines() });
  },

  moveExercise: async (routineId, from, to) => {
    await repo.moveRoutineExercise(routineId, from, to);
    set({ routines: await repo.listRoutines() });
  },

  startSession: async (routineId) => {
    const activeSession = await repo.createSession(routineId);
    set({ activeSession });
  },

  addSet: async (exerciseId) => {
    const active = get().activeSession;
    if (!active) {
      return;
    }
    const se = active.exercises.find((e) => e.exerciseId === exerciseId);
    if (!se) {
      return;
    }
    const newSet = await repo.addSessionSet(active.id, exerciseId, se.order, se.sets.length + 1);
    set({
      activeSession: {
        ...active,
        exercises: active.exercises.map((e) =>
          e.exerciseId === exerciseId ? { ...e, sets: [...e.sets, newSet] } : e,
        ),
      },
    });
  },

  removeSet: async (setId) => {
    const active = get().activeSession;
    if (!active) {
      return;
    }
    await repo.deleteSessionSet(setId);
    set({
      activeSession: {
        ...active,
        exercises: active.exercises.map((e) => ({
          ...e,
          sets: e.sets.filter((s) => s.id !== setId),
        })),
      },
    });
  },

  updateSet: async (setId, field, value) => {
    await repo.updateSessionSet(setId, field, value);
    const active = get().activeSession;
    if (!active) {
      return;
    }
    set({
      activeSession: {
        ...active,
        exercises: active.exercises.map((e) => ({
          ...e,
          sets: e.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
        })),
      },
    });
  },

  finishSession: async () => {
    const active = get().activeSession;
    if (!active) {
      return null;
    }
    const sessionId = active.id;
    await repo.finishSession(sessionId);
    const sessions = await repo.listSessions();
    set({ sessions, activeSession: null });
    return sessionId;
  },
}));
