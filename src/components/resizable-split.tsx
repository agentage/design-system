'use client';

import { useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  assertStorageKey,
  resizableSplitCollapsedVar,
  resizableSplitVar,
  type SplitOrientation,
} from '../lib/split-px';
import { ResizableHandle } from './resizable.parts';
import { useSplitState } from './use-split-state';
import { SplitContext, type ResizableSplitApi } from './resizable-split.context';

export { useResizableSplit, type ResizableSplitApi } from './resizable-split.context';

export { resizableSplitCollapsedVar, resizableSplitVar } from '../lib/split-px';

const KEY_STEP = 16;
const SHIFT_STEP = 64;

export interface ResizableSplitProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** `localStorage` key of the sized pane; also names the CSS variables. `[A-Za-z0-9._:-]`, max 64. */
  storageKey: string;
  /** Sized pane size in px before any stored value exists. */
  init: number;
  min: number;
  max: number;
  /** `horizontal`: first pane is sized, left to right. `vertical`: last pane (bottom) is sized. */
  orientation?: SplitOrientation;
  /** Lets the sized pane collapse to 0px; the state is stored under `<storageKey>.collapsed`. */
  collapsible?: boolean;
  /** Accessible name of the separator. */
  label?: string;
  onWidthChange?: (px: number) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Imperative toggle for a control outside the split. */
  apiRef?: Ref<ResizableSplitApi>;
  /** Two panes in visual order: start/end (horizontal) or top/bottom (vertical). */
  children: [ReactNode, ReactNode];
}

/**
 * Two panes, one sized in px. The size and collapsed flag are read from CSS variables that
 * `resizableSplitPrepaint` sets before first paint, so a reload never shifts the layout; without
 * it the mount effect applies the stored values (one shift, never a silent desync).
 */
export const ResizableSplit = ({
  storageKey,
  init,
  min,
  max,
  orientation = 'horizontal',
  collapsible = false,
  label = 'Resize panes',
  onWidthChange,
  onCollapsedChange,
  apiRef,
  children,
  className,
  style,
  ...props
}: ResizableSplitProps): React.JSX.Element => {
  assertStorageKey(storageKey);
  const name = resizableSplitVar(storageKey);
  const collapsedName = resizableSplitCollapsedVar(storageKey);
  const vertical = orientation === 'vertical';
  const root = useRef<HTMLDivElement>(null);
  const grab = useRef<number | null>(null);
  const { api, set } = useSplitState({
    storageKey,
    init,
    min,
    max,
    collapsible,
    onWidthChange,
    onCollapsedChange,
    apiRef,
  });
  const { width, collapsed } = api;

  const isRtl = (): boolean => root.current?.closest('[dir]')?.getAttribute('dir') === 'rtl';

  // Pointer distance from the sized pane's outer edge, so the size follows the pointer.
  const pointerSize = (e: React.PointerEvent): number => {
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return width;
    if (vertical) return rect.bottom - e.clientY;
    return isRtl() ? rect.right - e.clientX : e.clientX - rect.left;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const step = e.shiftKey ? SHIFT_STEP : KEY_STEP;
    const grow = vertical ? 'ArrowUp' : isRtl() ? 'ArrowLeft' : 'ArrowRight';
    const shrink = vertical ? 'ArrowDown' : isRtl() ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === 'Home') set(min);
    else if (e.key === 'End') set(max);
    else if (e.key === grow) set(width + step);
    else if (e.key === shrink) set(width - step);
    else if (e.key === 'Enter' && collapsible) api.toggle();
    else return;
    e.preventDefault();
  };

  const size = `var(${collapsedName}, clamp(${String(min)}px, var(${name}, ${String(init)}px), ${String(max)}px))`;
  const template = vertical ? `minmax(0, 1fr) 1px ${size}` : `${size} 1px minmax(0, 1fr)`;
  const pane = (index: 0 | 1): React.JSX.Element => {
    const sized = collapsed && (index === 1) === vertical;
    return (
      <div
        data-slot={index === 0 ? 'resizable-split-start' : 'resizable-split-end'}
        className="min-h-0 min-w-0 overflow-auto"
        style={sized ? { visibility: 'hidden', overflow: 'hidden' } : undefined}
        aria-hidden={sized || undefined}
      >
        {children[index]}
      </div>
    );
  };

  return (
    <SplitContext.Provider value={api}>
      <div
        ref={root}
        data-slot="resizable-split"
        data-orientation={orientation}
        data-collapsed={collapsed || undefined}
        className={['grid h-full min-h-0 w-full overflow-hidden', className]
          .filter(Boolean)
          .join(' ')}
        style={
          {
            ...style,
            [vertical ? 'gridTemplateRows' : 'gridTemplateColumns']: template,
          } as CSSProperties
        }
        {...props}
      >
        {pane(0)}
        <ResizableHandle
          direction={vertical ? 'vertical' : 'horizontal'}
          aria-label={label}
          aria-valuenow={width}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={collapsed ? 'collapsed' : `${String(width)}px`}
          className="touch-none"
          onPointerDown={(e) => {
            e.preventDefault();
            e.currentTarget.focus();
            grab.current = pointerSize(e) - (collapsed ? 0 : width);
            e.currentTarget.setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (grab.current !== null) set(pointerSize(e) - grab.current);
          }}
          onPointerUp={() => {
            grab.current = null;
          }}
          onPointerCancel={() => {
            grab.current = null;
          }}
          onKeyDown={onKeyDown}
        />
        {pane(1)}
      </div>
    </SplitContext.Provider>
  );
};
