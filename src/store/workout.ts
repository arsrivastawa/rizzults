import { create } from 'zustand';

import { initDatabase } from '@/db/database';
import * as repo from '@/db/repo';
import type { LastSet, NewExerciseInput } from '@/db/repo';
import { isEmptySet, type Unit } from '@/lib/units';
import type { ActiveSession, Exercise, Routine, Session, SessionSetField, SessionSet } from '@/types';

async function loadLastSets(active: ActiveSession | null): Promise<Record<string, LastSet | null>> {
  if (!active) {
    return {};
  }
  const result: Record<string, LastSet | null> = {};
  for (const se of active.exercises) {
    result[se.exerciseId] = await repo.getLastSet(se.exerciseId);
  }
  return result;
}

function nextSetNumber(sets: SessionSet[]): number {
  return sets.reduce((max, s) => Math.max(max, s.setNumber), 0) + 1;
}

type WorkoutStore = {
  hydrated: boolean;
  unit: Unit;
  exercises: Exercise[];
  routines: Routine[];
  sessions: Session[];
  activeSession: ActiveSession | null;
  lastSets: Record<string, LastSet | null>;

  hydrate: () => Promise<void>;
  reloadAll: () => Promise<void>;
  setUnit: (unit: Unit) => Promise<void>;

  addExerciseToRoutine: (routineId: number, exerciseId: string) => Promise<void>;
  removeExerciseFromRoutine: (routineId: number, exerciseId: string) => Promise<void>;
  moveExercise: (routineId: number, from: number, to: number) => Promise<void>;
  renameRoutine: (routineId: number, name: string) => Promise<void>;
  createRoutine: () => Promise<number>;
  deleteRoutine: (routineId: number) => Promise<void>;

  createCustomExercise: (input: NewExerciseInput) => Promise<void>;

  startSession: (routineId: number) => Promise<void>;
  addSet: (exerciseId: string) => Promise<void>;
  removeSet: (setId: number) => Promise<void>;
  updateSet: (setId: number, field: SessionSetField, value: number | null) => Promise<void>;
  finishSession: () => Promise<number | null>;

  editSessionUpdateSet: (sessionId: number, setId: number, field: SessionSetField, value: number | null) => Promise<void>;
  editSessionRemoveSet: (sessionId: number, setId: number) => Promise<void>;
  editSessionAddSet: (sessionId: number, exerciseId: string) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
};

export const useWorkoutStore = create<WorkoutStore>()((set, get) => ({
  hydrated: false,
  unit: 'kg',
  exercises: [],
  routines: [],
  sessions: [],
  activeSession: null,
  lastSets: {},

  hydrate: async () => {
    if (get().hydrated) {
      return;
    }
    await initDatabase();
    const [exercises, routines, sessions, activeSession, storedUnit] = await Promise.all([
      repo.listExercises(),
      repo.listRoutines(),
      repo.listSessions(),
      repo.getActiveSession(),
      repo.getSetting('unit'),
    ]);
    const unit: Unit = storedUnit === 'lb' ? 'lb' : 'kg';
    const lastSets = await loadLastSets(activeSession);
    set({ exercises, routines, sessions, activeSession, unit, lastSets, hydrated: true });
  },

  reloadAll: async () => {
    const [exercises, routines, sessions, activeSession, storedUnit] = await Promise.all([
      repo.listExercises(),
      repo.listRoutines(),
      repo.listSessions(),
      repo.getActiveSession(),
      repo.getSetting('unit'),
    ]);
    const unit: Unit = storedUnit === 'lb' ? 'lb' : 'kg';
    const lastSets = await loadLastSets(activeSession);
    set({ exercises, routines, sessions, activeSession, unit, lastSets });
  },

  setUnit: async (unit) => {
    set({ unit });
    await repo.setSetting('unit', unit);
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

  renameRoutine: async (routineId, name) => {
    await repo.renameRoutine(routineId, name);
    set({ routines: await repo.listRoutines() });
  },

  createRoutine: async () => {
    const routineId = await repo.createRoutine();
    set({ routines: await repo.listRoutines() });
    return routineId;
  },

  deleteRoutine: async (routineId) => {
    await repo.deleteRoutine(routineId);
    set({ routines: await repo.listRoutines() });
  },

  createCustomExercise: async (input) => {
    await repo.createCustomExercise(input);
    set({ exercises: await repo.listExercises() });
  },

  startSession: async (routineId) => {
    const activeSession = await repo.createSession(routineId);
    const lastSets = await loadLastSets(activeSession);
    set({ activeSession, lastSets });
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
    const newSet = await repo.addSessionSet(active.id, exerciseId, se.order, nextSetNumber(se.sets));
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
    const hasCompleted = active.exercises.some((e) => e.sets.some((s) => !isEmptySet(s)));
    if (!hasCompleted) {
      return null;
    }
    const sessionId = active.id;
    await repo.finishSession(sessionId);
    const sessions = await repo.listSessions();
    set({ sessions, activeSession: null, lastSets: {} });
    return sessionId;
  },

  editSessionUpdateSet: async (sessionId, setId, field, value) => {
    await repo.updateSessionSet(setId, field, value);
    set({
      sessions: get().sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              exercises: s.exercises.map((e) => ({
                ...e,
                sets: e.sets.map((st) => (st.id === setId ? { ...st, [field]: value } : st)),
              })),
            }
          : s,
      ),
    });
  },

  editSessionRemoveSet: async (sessionId, setId) => {
    await repo.deleteSessionSet(setId);
    set({
      sessions: get().sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              exercises: s.exercises.map((e) => ({
                ...e,
                sets: e.sets.filter((st) => st.id !== setId),
              })),
            }
          : s,
      ),
    });
  },

  editSessionAddSet: async (sessionId, exerciseId) => {
    const session = get().sessions.find((s) => s.id === sessionId);
    if (!session) {
      return;
    }
    const se = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (!se) {
      return;
    }
    const newSet = await repo.addSessionSet(sessionId, exerciseId, se.order, nextSetNumber(se.sets));
    set({
      sessions: get().sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              exercises: s.exercises.map((e) =>
                e.exerciseId === exerciseId ? { ...e, sets: [...e.sets, newSet] } : e,
              ),
            }
          : s,
      ),
    });
  },

  deleteSession: async (sessionId) => {
    await repo.deleteSession(sessionId);
    set({ sessions: await repo.listSessions() });
  },
}));
