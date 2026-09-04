import type { SQLiteDatabase } from 'expo-sqlite';

import { getDb } from '@/db/database';
import { formatDateLabel, formatTimeOfDay, toLocalDateString } from '@/lib/format';
import type {
  ActiveSession,
  Exercise,
  Routine,
  RoutineExercise,
  Session,
  SessionExercise,
  SessionSet,
  SessionSetField,
  TrackingType,
} from '@/types';

type ExerciseRow = {
  id: string;
  name: string;
  category: string | null;
  equipment: string | null;
  primary_muscles: string;
  secondary_muscles: string;
  mechanic: string | null;
  force: string | null;
  instructions: string;
  tracking_type: string;
  is_custom: number;
};

type RoutineRow = { id: number; name: string; notes: string | null };
type RoutineExerciseRow = {
  id: number;
  routine_id: number;
  exercise_id: string;
  position: number;
  target_sets: number | null;
  target_rep_min: number | null;
  target_rep_max: number | null;
};

type SessionRow = {
  id: number;
  date: string;
  start_time: string;
  duration_seconds: number | null;
  routine_name: string | null;
};

type SessionSetRow = {
  id: number;
  exercise_id: string;
  exercise_order: number;
  set_number: number;
  weight: number | null;
  reps: number | null;
  duration_seconds: number | null;
  distance: number | null;
  is_warmup: number;
  completed: number;
};

const SET_FIELDS: Record<SessionSetField, string> = {
  weight: 'weight',
  reps: 'reps',
  durationSeconds: 'duration_seconds',
  distance: 'distance',
};

function mapExerciseRow(r: ExerciseRow): Exercise {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    equipment: r.equipment,
    primaryMuscles: r.primary_muscles,
    secondaryMuscles: r.secondary_muscles,
    mechanic: r.mechanic,
    force: r.force,
    instructions: r.instructions,
    trackingType: r.tracking_type as TrackingType,
    isCustom: r.is_custom === 1,
  };
}

function mapSetRow(r: SessionSetRow): SessionSet {
  return {
    id: r.id,
    exerciseId: r.exercise_id,
    setNumber: r.set_number,
    weight: r.weight,
    reps: r.reps,
    durationSeconds: r.duration_seconds,
    distance: r.distance,
    isWarmup: r.is_warmup === 1,
    completed: r.completed === 1,
  };
}

async function loadSessionExercises(db: SQLiteDatabase, sessionId: number): Promise<SessionExercise[]> {
  const rows = await db.getAllAsync<SessionSetRow>(
    `SELECT id, exercise_id, exercise_order, set_number, weight, reps, duration_seconds, distance, is_warmup, completed
     FROM session_sets WHERE session_id = ? ORDER BY exercise_order, set_number, id`,
    sessionId,
  );
  const byOrder = new Map<number, SessionExercise>();
  for (const r of rows) {
    let se = byOrder.get(r.exercise_order);
    if (!se) {
      se = { exerciseId: r.exercise_id, order: r.exercise_order, sets: [] };
      byOrder.set(r.exercise_order, se);
    }
    se.sets.push(mapSetRow(r));
  }
  return [...byOrder.values()];
}

export async function listExercises(): Promise<Exercise[]> {
  const rows = await getDb().getAllAsync<ExerciseRow>(
    `SELECT id, name, category, equipment, primary_muscles, secondary_muscles, mechanic, force, instructions, tracking_type, is_custom
     FROM exercises ORDER BY name`,
  );
  return rows.map(mapExerciseRow);
}

export async function listRoutines(): Promise<Routine[]> {
  const db = getDb();
  const rows = await db.getAllAsync<RoutineRow>(
    `SELECT id, name, notes FROM routines ORDER BY position IS NULL, position, id`,
  );
  const reRows = await db.getAllAsync<RoutineExerciseRow>(
    `SELECT id, routine_id, exercise_id, position, target_sets, target_rep_min, target_rep_max
     FROM routine_exercises ORDER BY routine_id, position, id`,
  );
  const byRoutine = new Map<number, RoutineExercise[]>();
  for (const r of reRows) {
    const list = byRoutine.get(r.routine_id) ?? [];
    list.push({
      exerciseId: r.exercise_id,
      position: r.position,
      targetSets: r.target_sets,
      targetRepMin: r.target_rep_min,
      targetRepMax: r.target_rep_max,
    });
    byRoutine.set(r.routine_id, list);
  }
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    notes: r.notes,
    exercises: byRoutine.get(r.id) ?? [],
  }));
}

export async function addRoutineExercise(routineId: number, exerciseId: string): Promise<void> {
  const db = getDb();
  const row = await db.getFirstAsync<{ maxPos: number | null }>(
    `SELECT MAX(position) AS maxPos FROM routine_exercises WHERE routine_id = ?`,
    routineId,
  );
  const position = (row?.maxPos ?? -1) + 1;
  await db.runAsync(
    `INSERT INTO routine_exercises (routine_id, exercise_id, position, target_sets, target_rep_min, target_rep_max)
     VALUES (?, ?, ?, 3, NULL, NULL)`,
    routineId,
    exerciseId,
    position,
  );
}

export async function removeRoutineExercise(routineId: number, exerciseId: string): Promise<void> {
  await getDb().runAsync(
    `DELETE FROM routine_exercises WHERE routine_id = ? AND exercise_id = ?`,
    routineId,
    exerciseId,
  );
}

export async function moveRoutineExercise(routineId: number, from: number, to: number): Promise<void> {
  const db = getDb();
  const rows = await db.getAllAsync<{ id: number }>(
    `SELECT id FROM routine_exercises WHERE routine_id = ? ORDER BY position, id`,
    routineId,
  );
  const ids = rows.map((r) => r.id);
  if (from < 0 || from >= ids.length || to < 0 || to >= ids.length || from === to) {
    return;
  }
  const [moved] = ids.splice(from, 1);
  ids.splice(to, 0, moved);
  await db.withTransactionAsync(async () => {
    for (let i = 0; i < ids.length; i += 1) {
      await db.runAsync(`UPDATE routine_exercises SET position = ? WHERE id = ?`, i, ids[i]);
    }
  });
}

export async function addSessionSet(
  sessionId: number,
  exerciseId: string,
  order: number,
  setNumber: number,
): Promise<SessionSet> {
  const db = getDb();
  const result = await db.runAsync(
    `INSERT INTO session_sets (session_id, exercise_id, exercise_order, set_number, weight, reps, duration_seconds, distance, rpe, is_warmup, completed)
     VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, 0, 1)`,
    sessionId,
    exerciseId,
    order,
    setNumber,
  );
  return {
    id: result.lastInsertRowId,
    exerciseId,
    setNumber,
    weight: null,
    reps: null,
    durationSeconds: null,
    distance: null,
    isWarmup: false,
    completed: true,
  };
}

export async function updateSessionSet(setId: number, field: SessionSetField, value: number | null): Promise<void> {
  const column = SET_FIELDS[field];
  await getDb().runAsync(`UPDATE session_sets SET ${column} = ? WHERE id = ?`, value, setId);
}

export async function deleteSessionSet(setId: number): Promise<void> {
  await getDb().runAsync(`DELETE FROM session_sets WHERE id = ?`, setId);
}

export async function createSession(routineId: number | null): Promise<ActiveSession> {
  const db = getDb();
  const now = new Date();
  const startIso = now.toISOString();
  const dateStr = toLocalDateString(now);
  const result = await db.runAsync(
    `INSERT INTO sessions (routine_id, date, start_time, end_time, duration_seconds, notes)
     VALUES (?, ?, ?, NULL, NULL, NULL)`,
    routineId,
    dateStr,
    startIso,
  );
  const sessionId = result.lastInsertRowId;

  let routineName: string | null = null;
  const order: { exerciseId: string; index: number }[] = [];
  if (routineId != null) {
    const routine = await db.getFirstAsync<{ name: string }>(`SELECT name FROM routines WHERE id = ?`, routineId);
    routineName = routine?.name ?? null;
    const reRows = await db.getAllAsync<{ exercise_id: string }>(
      `SELECT exercise_id FROM routine_exercises WHERE routine_id = ? ORDER BY position, id`,
      routineId,
    );
    reRows.forEach((r, i) => order.push({ exerciseId: r.exercise_id, index: i }));
  }

  const exercises: SessionExercise[] = [];
  for (const o of order) {
    const set = await addSessionSet(sessionId, o.exerciseId, o.index, 1);
    exercises.push({ exerciseId: o.exerciseId, order: o.index, sets: [set] });
  }

  return { id: sessionId, routineId, routineName, startedAt: now.getTime(), exercises };
}

export async function getActiveSession(): Promise<ActiveSession | null> {
  const db = getDb();
  const row = await db.getFirstAsync<{ id: number; routine_id: number | null; start_time: string }>(
    `SELECT id, routine_id, start_time FROM sessions WHERE end_time IS NULL ORDER BY start_time DESC, id DESC LIMIT 1`,
  );
  if (!row) {
    return null;
  }
  let routineName: string | null = null;
  if (row.routine_id != null) {
    const routine = await db.getFirstAsync<{ name: string }>(`SELECT name FROM routines WHERE id = ?`, row.routine_id);
    routineName = routine?.name ?? null;
  }
  const exercises = await loadSessionExercises(db, row.id);
  return {
    id: row.id,
    routineId: row.routine_id,
    routineName,
    startedAt: Date.parse(row.start_time),
    exercises,
  };
}

export async function finishSession(sessionId: number): Promise<void> {
  const db = getDb();
  const row = await db.getFirstAsync<{ start_time: string }>(`SELECT start_time FROM sessions WHERE id = ?`, sessionId);
  const endIso = new Date().toISOString();
  const duration = row ? Math.max(0, Math.round((Date.now() - Date.parse(row.start_time)) / 1000)) : 0;
  await db.runAsync(`UPDATE sessions SET end_time = ?, duration_seconds = ? WHERE id = ?`, endIso, duration, sessionId);
}

export async function listSessions(): Promise<Session[]> {
  const db = getDb();
  const rows = await db.getAllAsync<SessionRow>(
    `SELECT s.id, s.date, s.start_time, s.duration_seconds, r.name AS routine_name
     FROM sessions s LEFT JOIN routines r ON r.id = s.routine_id
     WHERE s.end_time IS NOT NULL
     ORDER BY s.date DESC, s.start_time DESC, s.id DESC`,
  );
  const sessions: Session[] = [];
  for (const r of rows) {
    const startedAt = Date.parse(r.start_time);
    sessions.push({
      id: r.id,
      routineName: r.routine_name,
      dateLabel: formatDateLabel(startedAt),
      startTime: formatTimeOfDay(startedAt),
      durationSeconds: r.duration_seconds,
      exercises: await loadSessionExercises(db, r.id),
    });
  }
  return sessions;
}
