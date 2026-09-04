export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const sec = s % 60;
  const min = Math.floor(s / 60) % 60;
  const hr = Math.floor(s / 3600);
  const mm = String(min).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  if (hr > 0) {
    return `${hr}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  if (s < 60) {
    return `${s} sec`;
  }
  const m = Math.floor(s / 60);
  if (m < 60) {
    return `${m} min`;
  }
  const h = Math.floor(m / 60);
  const rm = m % 60;
  if (rm === 0) {
    return `${h} hr`;
  }
  return `${h} hr ${rm} min`;
}

export function formatTimeOfDay(ms: number): string {
  const d = new Date(ms);
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h %= 12;
  if (h === 0) {
    h = 12;
  }
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDateLabel(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  if (diffDays <= 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

let counter = 0;

export function uid(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
