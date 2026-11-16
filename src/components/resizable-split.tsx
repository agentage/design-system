'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  clampPx,
  readStoredPx,
  resizableSplitPrepaint,
  resizableSplitVar,
  writeStoredPx,
} from '../lib/split-px';
import { ResizableHandle } from './resizable.parts';

export { resizableSplitPrepaint, resizableSplitVar } from '../lib/split-px';

const KEY_STEP = 16;
const SHIFT_STEP = 64;

export interface ResizableSplitProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** `localStorage` key for the first pane width; also names the CSS variable. */
  storageKey: string;
  /** First pane width in px before any stored value exists. */
  init: number;
  min: number;
  max: number;
  /** Accessible name of the separator. */
  label?: string;
  onWidthChange?: (px: number) => void;
  /** Start pane (fixed px width) and end pane (fills the rest). */
  children: [ReactNode, ReactNode];
}

/**
 * Two panes, the first sized in px. The width is read from a CSS variable that
 * `resizableSplitPrepaint` sets before first paint, so a reload never shifts the layout.
 */
export const ResizableSplit = ({
  storageKey,
  init,
  min,
  max,
  label = 'Resize panes',
  onWidthChange,
  children,
  className,
  style,
  ...props
}: ResizableSplitProps): React.JSX.Element => {
  const name = resizableSplitVar(storageKey);
  const [width, setWidth] = useState(() => clampPx(init, min, max));
  const root = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Only the aria value waits for mount; the layout reads the CSS variable.
  useEffect(() => {
    const stored = readStoredPx(storageKey);
    if (stored !== null) setWidth(clampPx(stored, min, max));
  }, [storageKey, min, max]);

  const set = (px: number): void => {
    const next = clampPx(px, min, max);
    setWidth(next);
    document.documentElement.style.setProperty(name, `${String(next)}px`);
    writeStoredPx(storageKey, next);
    onWidthChange?.(next);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const step = e.shiftKey ? SHIFT_STEP : KEY_STEP;
    if (e.key === 'Home') set(min);
    else if (e.key === 'End') set(max);
    else if (e.key === 'ArrowRight') set(width + step);
    else if (e.key === 'ArrowLeft') set(width - step);
    else return;
    e.preventDefault();
  };

  const columns = `clamp(${String(min)}px, var(${name}, ${String(init)}px), ${String(max)}px) 1px minmax(0, 1fr)`;

  return (
    <div
      ref={root}
      data-slot="resizable-split"
      className={['grid h-full min-h-0 w-full overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, gridTemplateColumns: columns } as CSSProperties}
      {...props}
    >
      <div data-slot="resizable-split-start" className="min-h-0 min-w-0 overflow-auto">
        {children[0]}
      </div>
      <ResizableHandle
        aria-label={label}
        aria-valuenow={width}
        aria-valuemin={min}
        aria-valuemax={max}
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.focus();
          dragging.current = true;
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (dragging.current) set(e.clientX - (root.current?.getBoundingClientRect().left ?? 0));
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        onKeyDown={onKeyDown}
      />
      <div data-slot="resizable-split-end" className="min-h-0 min-w-0 overflow-auto">
        {children[1]}
      </div>
    </div>
  );
};

export interface ResizableSplitPrepaintProps {
  /** Storage keys of every `ResizableSplit` on the page. */
  storageKeys: string[];
}

/** Render in `<head>` (or top of `<body>`) so the stored widths apply before first paint. */
export const ResizableSplitPrepaint = ({
  storageKeys,
}: ResizableSplitPrepaintProps): React.JSX.Element => (
  <script dangerouslySetInnerHTML={{ __html: resizableSplitPrepaint(storageKeys) }} />
);
