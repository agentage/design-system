'use client';

import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from 'react';

export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';
export type AnchorAlign = 'start' | 'center' | 'end';

export interface AnchorPositionOptions {
  side?: AnchorSide;
  align?: AnchorAlign;
  /** Gap between anchor and surface, in px. */
  offset?: number;
}

export interface AnchorPosition {
  top: number;
  left: number;
}

const MARGIN = 8;

const clamp = (value: number, size: number, viewport: number): number =>
  Math.max(MARGIN, Math.min(value, viewport - size - MARGIN));

// useLayoutEffect warns on the server; anchored surfaces only ever render on the client.
const useIsomorphicLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Fixed-position coordinates for a portalled surface anchored to a trigger.
 * Measures both rects, flips when the preferred side has no room, clamps to the viewport,
 * and re-measures on scroll and resize.
 */
export const useAnchorPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  surfaceRef: RefObject<HTMLElement | null>,
  open: boolean,
  { side = 'bottom', align = 'center', offset = MARGIN }: AnchorPositionOptions = {}
): AnchorPosition => {
  const [position, setPosition] = useState<AnchorPosition>({ top: 0, left: 0 });

  const update = useCallback(() => {
    const anchor = anchorRef.current?.getBoundingClientRect();
    const surface = surfaceRef.current?.getBoundingClientRect();
    if (!anchor || !surface) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top: number;
    let left: number;

    if (side === 'top' || side === 'bottom') {
      top = side === 'top' ? anchor.top - surface.height - offset : anchor.bottom + offset;
      if (side === 'top' && top < MARGIN) top = anchor.bottom + offset;
      if (side === 'bottom' && top + surface.height > vh - MARGIN) {
        top = anchor.top - surface.height - offset;
      }
      left =
        align === 'start'
          ? anchor.left
          : align === 'end'
            ? anchor.right - surface.width
            : anchor.left + anchor.width / 2 - surface.width / 2;
    } else {
      left = side === 'left' ? anchor.left - surface.width - offset : anchor.right + offset;
      if (side === 'left' && left < MARGIN) left = anchor.right + offset;
      if (side === 'right' && left + surface.width > vw - MARGIN) {
        left = anchor.left - surface.width - offset;
      }
      top =
        align === 'start'
          ? anchor.top
          : align === 'end'
            ? anchor.bottom - surface.height
            : anchor.top + anchor.height / 2 - surface.height / 2;
    }

    const next = {
      top: clamp(top, surface.height, vh),
      left: clamp(left, surface.width, vw),
    };
    setPosition((prev) => (prev.top === next.top && prev.left === next.left ? prev : next));
  }, [anchorRef, surfaceRef, side, align, offset]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    update();

    const handle = (): void => update();
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return (): void => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
    };
  }, [open, update]);

  return position;
};
