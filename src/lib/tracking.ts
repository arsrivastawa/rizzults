import type { SessionSetField, TrackingType } from '@/types';

export type TrackingField = {
  key: SessionSetField;
  label: string;
  unit: string;
  placeholder: string;
};

export const trackingFields: Record<TrackingType, TrackingField[]> = {
  weight_reps: [
    { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '0' },
    { key: 'reps', label: 'Reps', unit: 'reps', placeholder: '0' },
  ],
  bodyweight_reps: [{ key: 'reps', label: 'Reps', unit: 'reps', placeholder: '0' }],
  time: [{ key: 'durationSeconds', label: 'Time', unit: 'sec', placeholder: '0' }],
  weight_time: [
    { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '0' },
    { key: 'durationSeconds', label: 'Time', unit: 'sec', placeholder: '0' },
  ],
  distance_time: [
    { key: 'distance', label: 'Distance', unit: 'km', placeholder: '0' },
    { key: 'durationSeconds', label: 'Time', unit: 'sec', placeholder: '0' },
  ],
  count: [{ key: 'reps', label: 'Count', unit: 'reps', placeholder: '0' }],
};
