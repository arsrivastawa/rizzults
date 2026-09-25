export const MIGRATIONS: string[] = [
  `
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  equipment TEXT,
  primary_muscles TEXT,
  secondary_muscles TEXT,
  mechanic TEXT,
  force TEXT,
  instructions TEXT,
  tracking_type TEXT NOT NULL,
  is_custom INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  notes TEXT,
  position INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS routine_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  position INTEGER NOT NULL,
  target_sets INTEGER,
  target_rep_min INTEGER,
  target_rep_max INTEGER,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  routine_id INTEGER REFERENCES routines(id),
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  duration_seconds INTEGER,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS session_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES exercises(id),
  exercise_order INTEGER NOT NULL,
  set_number INTEGER NOT NULL,
  weight REAL,
  reps INTEGER,
  duration_seconds REAL,
  distance REAL,
  rpe REAL,
  is_warmup INTEGER DEFAULT 0,
  completed INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`,
  `
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`,
  `
ALTER TABLE sessions ADD COLUMN bodyweight REAL;

ALTER TABLE routine_exercises ADD COLUMN target_rir REAL CHECK (target_rir IS NULL OR target_rir BETWEEN 0 AND 10);
ALTER TABLE routine_exercises ADD COLUMN target_rest_seconds INTEGER;

ALTER TABLE session_sets ADD COLUMN rest_seconds INTEGER;
ALTER TABLE session_sets ADD COLUMN rir REAL CHECK (rir IS NULL OR rir BETWEEN 0 AND 10);
ALTER TABLE session_sets ADD COLUMN load_basis TEXT NOT NULL DEFAULT 'total';
ALTER TABLE session_sets ADD COLUMN superset_group INTEGER;
ALTER TABLE session_sets ADD COLUMN notes TEXT;

CREATE INDEX IF NOT EXISTS idx_session_sets_exercise_session ON session_sets(exercise_id, session_id);
CREATE INDEX IF NOT EXISTS idx_session_sets_session_order ON session_sets(session_id, exercise_order, set_number);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_routine_start ON sessions(routine_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_session_sets_session_exercise ON session_sets(session_id, exercise_id, set_number);
`,
];
