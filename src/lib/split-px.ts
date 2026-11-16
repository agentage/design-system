/** Pixel sizing + pre-paint restore for `ResizableSplit`. Server-safe: no React. */

const MAX_STORED_PX = 8000;
const KEY_PATTERN = /^[A-Za-z0-9._:-]{1,64}$/;

export type SplitOrientation = 'horizontal' | 'vertical';

export const clampPx = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.round(value)));

export const assertStorageKey = (storageKey: string): void => {
  if (!KEY_PATTERN.test(storageKey)) {
    throw new Error(`ResizableSplit: storageKey must match ${String(KEY_PATTERN)}`);
  }
};

// Letters, digits and "-" stay; everything else (incl. "_") becomes _<hex>_, so no two keys collide.
const encodeKey = (storageKey: string): string => {
  assertStorageKey(storageKey);
  return storageKey.replace(/[^A-Za-z0-9-]/g, (c) => `_${(c.codePointAt(0) ?? 0).toString(16)}_`);
};

/** CSS custom property that carries the stored size of a split. */
export const resizableSplitVar = (storageKey: string): string => `--split-${encodeKey(storageKey)}`;

/** CSS custom property that is `0px` while the split is collapsed. */
export const resizableSplitCollapsedVar = (storageKey: string): string =>
  `--splitc-${encodeKey(storageKey)}`;

export const collapsedStorageKey = (storageKey: string): string => `${storageKey}.collapsed`;

export const escapeForScript = (json: string): string =>
  json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/**
 * Inline script for the document head: copies each stored size (and collapsed flag) onto
 * `<html>` as CSS variables, so the first paint already has the final layout.
 */
export const resizableSplitPrepaint = (storageKeys: string[]): string => {
  const entries = escapeForScript(
    JSON.stringify(
      storageKeys.map((key) => [
        key,
        resizableSplitVar(key),
        collapsedStorageKey(key),
        resizableSplitCollapsedVar(key),
      ])
    )
  );
  return (
    `try{var d=document.documentElement,L=localStorage;${entries}.forEach(function(e){` +
    `var n=parseInt(L.getItem(e[0]),10);` +
    `if(n>0&&n<${String(MAX_STORED_PX)})d.style.setProperty(e[1],n+'px');` +
    `if(L.getItem(e[2])==='1')d.style.setProperty(e[3],'0px')})}catch(e){}`
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

export const readStoredFlag = (storageKey: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(storageKey) === '1';
  } catch {
    return false;
  }
};

export const writeStored = (storageKey: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // Storage can be full or blocked; the value lives for this page only.
  }
};
