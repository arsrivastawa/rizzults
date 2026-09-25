import type { PreviousSet } from '@/db/repo';
import { formatClock } from '@/lib/format';
import type { TrackingType } from '@/types';

export type Unit = 'kg' | 'lb';

const LB_PER_KG = 2.20462;
const KG_PER_LB = 1 / LB_PER_KG;

export function toDisplayWeight(kg: number, unit: Unit): number {
  return unit === 'lb' ? kg * LB_PER_KG : kg;
}

export function fromDisplayWeight(display: number, unit: Unit): number {
  return unit === 'lb' ? display * KG_PER_LB : display;
}

export function formatNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

export function formatWeight(kg: number, unit: Unit): string {
  return formatNumber(toDisplayWeight(kg, unit));
}

export function formatPreviousSet(
  trackingType: TrackingType,
  set: PreviousSet | null | undefined,
  unit: Unit,
): string {
  if (!set) {
    return '-';
  }
  const rirSuffix = set.rir != null ? ` @${set.rir}` : '';
  switch (trackingType) {
    case 'weight_reps': {
      const w = set.weight != null ? formatWeight(set.weight, unit) : null;
      const r = set.reps != null ? `${set.reps}` : null;
      if (w && r) return `${w}x${r}${rirSuffix}`;
      if (w) return `${w}${rirSuffix}`;
      if (r) return `${r} reps${rirSuffix}`;
      return '-';
    }
    case 'bodyweight_reps':
      return set.reps != null ? `${set.reps} reps${rirSuffix}` : '-';
    case 'count':
      return set.reps != null ? `${set.reps}${rirSuffix}` : '-';
    case 'time':
      return set.durationSeconds != null ? `${formatClock(set.durationSeconds)}${rirSuffix}` : '-';
    case 'weight_time': {
      const w = set.weight != null ? formatWeight(set.weight, unit) : null;
      const t = set.durationSeconds != null ? formatClock(set.durationSeconds) : null;
      if (w && t) return `${w}x${t}${rirSuffix}`;
      if (w) return `${w}${rirSuffix}`;
      if (t) return `${t}${rirSuffix}`;
      return '-';
    }
    case 'distance_time': {
      const d = set.distance != null ? `${formatNumber(set.distance)}km` : null;
      const t = set.durationSeconds != null ? formatClock(set.durationSeconds) : null;
      if (d && t) return `${d}x${t}${rirSuffix}`;
      if (d) return `${d}${rirSuffix}`;
      if (t) return `${t}${rirSuffix}`;
      return '-';
    }
    default:
      return '-';
  }
}

export function isEmptySet(set: { weight: number | null; reps: number | null; durationSeconds: number | null; distance: number | null }): boolean {
  return (
    set.weight == null &&
    set.reps == null &&
    set.durationSeconds == null &&
    set.distance == null
  );
}
