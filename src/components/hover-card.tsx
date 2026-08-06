'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { withDescribedBy } from '../lib/aria';
import { useAnchorPosition, type AnchorAlign } from '../lib/use-anchor-position';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';

export interface HoverCardProps {
  trigger: ReactNode;
  children: ReactNode;
  openDelay?: number;
  closeDelay?: number;
  align?: AnchorAlign;
  side?: 'top' | 'bottom';
  className?: string;
  /** Accessible name for the card surface. */
  label?: string;
}

export const HoverCard = ({
  trigger,
  children,
  openDelay = 400,
  closeDelay = 200,
  align = 'center',
  side = 'bottom',
  className,
  label = 'More information',
}: HoverCardProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useMounted();
  const cardId = `${useId()}-hover-card`;
  const showing = open && mounted;

  const { top, left } = useAnchorPosition(anchorRef, surfaceRef, showing, { side, align });

  const show = useCallback((delay: number) => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), delay);
  }, []);

  const hide = useCallback((delay: number) => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), delay);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') hide(0);
    };
    document.addEventListener('keydown', handleEscape);
    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, hide]);

  const hoverProps = {
    onPointerEnter: (event: React.PointerEvent): void => {
      if (event.pointerType !== 'touch') show(openDelay);
    },
    onPointerLeave: (): void => hide(closeDelay),
  };

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex"
      {...hoverProps}
      onFocus={() => show(0)}
      onBlur={() => hide(closeDelay)}
      data-slot="hover-card"
    >
      {withDescribedBy(trigger, showing ? cardId : undefined)}
      {showing &&
        createPortal(
          <div
            ref={surfaceRef}
            id={cardId}
            role="dialog"
            aria-label={label}
            style={{ position: 'fixed', top, left }}
            className={cn(
              'z-[var(--z-overlay,50)] w-64 rounded-lg border border-border bg-popover p-4 shadow-md',
              className
            )}
            data-slot="hover-card-content"
            {...hoverProps}
          >
            {children}
          </div>,
          document.body
        )}
    </span>
  );
};
