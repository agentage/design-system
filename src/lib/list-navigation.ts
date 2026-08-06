/**
 * Wrapping target index for arrow / Home / End navigation over a list of `count` items.
 * `current` may be -1 (nothing active yet); returns null when the key does not navigate.
 * Set `horizontal` to false for controls where Left/Right belong to a text caret.
 */
export const nextListIndex = (
  key: string,
  current: number,
  count: number,
  horizontal = true
): number | null => {
  if (count === 0) return null;
  const last = count - 1;
  if (key === 'Home') return 0;
  if (key === 'End') return last;
  if (key === 'ArrowDown' || (horizontal && key === 'ArrowRight'))
    return current < 0 ? 0 : (current + 1) % count;
  if (key === 'ArrowUp' || (horizontal && key === 'ArrowLeft'))
    return current < 0 ? last : (current + last) % count;
  return null;
};
