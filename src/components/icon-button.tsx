import * as React from 'react';
import { cn } from '../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, title, 'aria-label': ariaLabel, disabled, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      title={title}
      aria-label={ariaLabel ?? title}
      disabled={disabled}
      data-slot="icon-button"
      className={cn(
        'flex items-center justify-center rounded-md p-1.5 transition-colors',
        'text-muted-foreground hover:bg-accent hover:text-foreground',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  )
);
IconButton.displayName = 'IconButton';
