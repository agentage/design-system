export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

export type SortableValue = string | number | boolean | Date | null | undefined;

const rank = (value: SortableValue): number | null => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return Number.isNaN(value) ? null : value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return null;
};

/** Nullish sorts last in both directions; dates/numbers/booleans numerically, the rest by locale. */
export const compareValues = (a: SortableValue, b: SortableValue): number => {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';
  if (aEmpty || bEmpty) return aEmpty && bEmpty ? 0 : aEmpty ? 1 : -1;

  const [ra, rb] = [rank(a), rank(b)];
  if (ra !== null && rb !== null) return ra - rb;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
};

/** Header clicks cycle the column through unsorted -> ascending -> descending -> unsorted. */
export const nextSortState = (current: SortState | null, key: string): SortState | null => {
  if (current?.key !== key) return { key, direction: 'asc' };
  return current.direction === 'asc' ? { key, direction: 'desc' } : null;
};
