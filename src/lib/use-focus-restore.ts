'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Remembers what was focused when `active` turned on and refocuses it on close.
 * Pass the overlay container so focus is only restored when it still lives inside.
 */
export const useFocusRestore = (
  active: boolean,
  containerRef?: RefObject<HTMLElement | null>
): void => {
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    // Captured now: refs are already detached by the time this cleanup runs.
    const container = containerRef?.current ?? null;
    opener.current = document.activeElement as HTMLElement | null;

    return (): void => {
      const focused = document.activeElement as HTMLElement | null;
      const stillInside =
        focused === null || focused === document.body || (container?.contains(focused) ?? false);
      if (stillInside) opener.current?.focus();
    };
  }, [active, containerRef]);
};
