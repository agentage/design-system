import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface HoverCardProps {
  trigger: ReactNode;
  children: ReactNode;
  openDelay?: number;
  closeDelay?: number;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
  className?: string;
}

export const HoverCard = ({
  trigger,
  children,
  openDelay = 400,
  closeDelay = 200,
  align = 'center',
  side = 'bottom',
  className,
}: HoverCardProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleEnter = (): void => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  };

  const handleLeave = (): void => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    []
  );

  const alignClass =
    align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const sideClass = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-slot="hover-card"
    >
      {trigger}
      {open && (
        <div
          className={cn(
            'absolute z-50 w-64 rounded-lg border border-border bg-popover p-4 shadow-md',
            sideClass,
            alignClass,
            className
          )}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {children}
        </div>
      )}
    </div>
  );
};
