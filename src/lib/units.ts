import type { LastSet } from '@/db/repo';
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

export function formatSetSummary(trackingType: TrackingType, set: LastSet, unit: Unit): string {
  switch (trackingType) {
    case 'weight_reps':
      return [set.weight != null ? `${formatWeight(set.weight, unit)} ${unit}` : null, set.reps != null ? `${set.reps} reps` : null]
        .filter(Boolean)
        .join(' x ');
    case 'bodyweight_reps':
      return set.reps != null ? `${set.reps} reps` : '';
    case 'count':
      return set.reps != null ? `${set.reps} reps` : '';
    case 'time':
      return set.durationSeconds != null ? `${formatNumber(set.durationSeconds)} sec` : '';
    case 'weight_time':
      return [
        set.weight != null ? `${formatWeight(set.weight, unit)} ${unit}` : null,
        set.durationSeconds != null ? `${formatNumber(set.durationSeconds)} sec` : null,
      ]
        .filter(Boolean)
        .join(' x ');
    case 'distance_time':
      return [
        set.distance != null ? `${formatNumber(set.distance)} km` : null,
        set.durationSeconds != null ? `${formatNumber(set.durationSeconds)} sec` : null,
      ]
        .filter(Boolean)
        .join(' x ');
    default:
      return '';
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
