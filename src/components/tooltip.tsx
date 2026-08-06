'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { withDescribedBy } from '../lib/aria';
import { useAnchorPosition, type AnchorSide } from '../lib/use-anchor-position';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';

export interface TooltipProps {
  content: ReactNode;
  children: React.ReactElement;
  side?: AnchorSide;
  delayMs?: number;
  className?: string;
}

export const Tooltip = ({
  content,
  children,
  side = 'top',
  delayMs = 300,
  className,
}: TooltipProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useMounted();
  const tooltipId = `${useId()}-tooltip`;
  const showing = open && mounted;

  const { top, left } = useAnchorPosition(anchorRef, surfaceRef, showing, {
    side,
    align: 'center',
  });

  const show = useCallback((delay: number) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delay);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') hide();
    };
    document.addEventListener('keydown', handleEscape);
    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, hide]);

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex"
      // Touch never opens a tooltip: the tap already activates the trigger underneath.
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') show(delayMs);
      }}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
      data-slot="tooltip"
    >
      {withDescribedBy(children, showing ? tooltipId : undefined)}
      {showing &&
        createPortal(
          <div
            ref={surfaceRef}
            id={tooltipId}
            role="tooltip"
            style={{ position: 'fixed', top, left }}
            className={cn(
              'z-[var(--z-overlay,50)] max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md',
              'animate-in fade-in-0 zoom-in-95',
              className
            )}
            data-slot="tooltip-content"
          >
            {content}
          </div>,
          document.body
        )}
    </span>
  );
};
