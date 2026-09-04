import type { ExportSetRow } from '@/db/repo';

const HEADER = [
  'date',
  'session_id',
  'session_start_time',
  'session_duration_min',
  'routine_name',
  'exercise_name',
  'category',
  'exercise_order',
  'set_number',
  'is_warmup',
  'weight',
  'reps',
  'duration_seconds',
  'distance',
  'rpe',
];

function escapeCell(value: unknown): string {
  const s = value == null ? '' : String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatMinutes(seconds: number | null): string {
  if (seconds == null) {
    return '';
  }
  return String(Math.round((seconds / 60) * 10) / 10);
}

export function buildCsv(rows: ExportSetRow[]): string {
  const lines = [HEADER.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.date,
        r.session_id,
        r.session_start_time,
        formatMinutes(r.session_duration_seconds),
        r.routine_name,
        r.exercise_name,
        r.category,
        r.exercise_order,
        r.set_number,
        r.is_warmup,
        r.weight,
        r.reps,
        r.duration_seconds,
        r.distance,
        r.rpe,
      ]
        .map(escapeCell)
        .join(','),
    );
  }
  return lines.join('\n');
}
