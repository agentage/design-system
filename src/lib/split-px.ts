/** Pixel sizing + pre-paint restore for `ResizableSplit`. */

const MAX_STORED_PX = 8000;

export const clampPx = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.round(value)));

/** CSS custom property that carries the stored width of a split, derived from its storage key. */
export const resizableSplitVar = (storageKey: string): string =>
  `--split-${storageKey.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

/**
 * Inline script for the document head: copies each stored width onto `<html>` as a CSS
 * variable, so the first paint already has the final size. Run it before any module.
 */
export const resizableSplitPrepaint = (storageKeys: string[]): string => {
  const entries = JSON.stringify(storageKeys.map((key) => [key, resizableSplitVar(key)]));
  return (
    `try{var d=document.documentElement,L=localStorage;${entries}.forEach(function(e){` +
    `var n=parseInt(L.getItem(e[0]),10);` +
    `if(n>0&&n<${String(MAX_STORED_PX)})d.style.setProperty(e[1],n+'px')})}catch(e){}`
  );
};

export const readStoredPx = (storageKey: string): number | null => {
  if (typeof window === 'undefined') return null;
  try {
    const n = parseInt(window.localStorage.getItem(storageKey) ?? '', 10);
    return n > 0 && n < MAX_STORED_PX ? n : null;
  } catch {
    return null;
  }
};

export const writeStoredPx = (storageKey: string, px: number): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, String(px));
  } catch {
    // Storage can be full or blocked; the width lives for this page only.
  }
};
