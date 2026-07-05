import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface TooltipProps {
  content: ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delayMs?: number;
  className?: string;
}

const sideClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export const Tooltip = ({
  content,
  children,
  side = 'top',
  delayMs = 300,
  className,
}: TooltipProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleEnter = (): void => {
    timeoutRef.current = setTimeout(() => setOpen(true), delayMs);
  };

  const handleLeave = (): void => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      data-slot="tooltip"
    >
      {children}
      {open && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md',
            'animate-in fade-in-0 zoom-in-95',
            sideClasses[side],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
