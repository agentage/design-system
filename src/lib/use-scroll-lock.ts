'use client';

import { useEffect } from 'react';

/** Freezes body scroll while `active`, padding out the width the scrollbar leaves behind. */
export const useScrollLock = (active: boolean): void => {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    body.style.paddingRight = `${String(Math.max(0, scrollbarWidth))}px`;

    return (): void => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [active]);
};
