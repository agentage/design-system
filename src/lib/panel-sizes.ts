/** Percentage sizing math + localStorage persistence for `ResizablePanelGroup`. */

export interface PanelConstraint {
  defaultSize?: number;
  minSize: number;
  maxSize: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number): number => Math.round(value * 100) / 100;

/** Seeds sizes from `defaultSize`, splitting whatever is left across the unsized panels. */
export const distributeSizes = (panels: PanelConstraint[]): number[] => {
  const unsized = panels.filter((p) => p.defaultSize === undefined).length;
  const claimed = panels.reduce((sum, p) => sum + (p.defaultSize ?? 0), 0);
  const share = unsized > 0 ? (100 - claimed) / unsized : 0;
  const raw = panels.map((p) => clamp(p.defaultSize ?? share, p.minSize, p.maxSize));
  const total = raw.reduce((sum, size) => sum + size, 0);
  return total === 0 ? raw : raw.map((size) => round((size / total) * 100));
};

/**
 * Moves the boundary after `index` by `deltaPct`, spending the delta on the two
 * adjacent panels only so every other panel keeps its size.
 */
export const resizeAt = (
  sizes: number[],
  panels: PanelConstraint[],
  index: number,
  deltaPct: number
): number[] => {
  const before = sizes[index];
  const after = sizes[index + 1];
  if (before === undefined || after === undefined) return sizes;

  const pair = before + after;
  const lower = Math.max(panels[index].minSize, pair - panels[index + 1].maxSize);
  const upper = Math.min(panels[index].maxSize, pair - panels[index + 1].minSize);
  if (lower > upper) return sizes;

  const next = [...sizes];
  next[index] = round(clamp(before + deltaPct, lower, upper));
  next[index + 1] = round(pair - next[index]);
  return next;
};

/** Absolute variant of `resizeAt` — used by Home/End, which target a bound directly. */
export const setSizeAt = (
  sizes: number[],
  panels: PanelConstraint[],
  index: number,
  size: number
): number[] => resizeAt(sizes, panels, index, size - sizes[index]);

const isSizeArray = (value: unknown, length: number): value is number[] =>
  Array.isArray(value) &&
  value.length === length &&
  value.every((n) => typeof n === 'number' && Number.isFinite(n));

export const readStoredSizes = (key: string | undefined, length: number): number[] | null => {
  if (!key || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw === null ? null : JSON.parse(raw);
    return isSizeArray(parsed, length) ? parsed : null;
  } catch {
    return null;
  }
};

export const writeStoredSizes = (key: string | undefined, sizes: number[]): void => {
  if (!key || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(sizes));
  } catch {
    // Storage can be full or blocked; sizes stay in memory for this session.
  }
};
