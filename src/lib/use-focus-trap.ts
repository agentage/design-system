'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Cycles Tab inside `ref` while `active`, then restores focus to whatever opened it. */
export const useFocusTrap = (ref: RefObject<HTMLElement | null>, active: boolean): void => {
  useEffect(() => {
    const container = ref.current;
    if (!active || !container) return;

    const opener = document.activeElement as HTMLElement | null;
    const initial = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (initial ?? container).focus();

    const handleTab = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;

      const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (elements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return (): void => {
      document.removeEventListener('keydown', handleTab);
      opener?.focus();
    };
  }, [ref, active]);
};
