export function filterByName<T extends { name: string }>(items: T[], query: string): T[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items;
  }
  try {
    const regex = new RegExp(trimmed, 'i');
    return items.filter((item) => regex.test(item.name));
  } catch {
    const lower = trimmed.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(lower));
  }
}
