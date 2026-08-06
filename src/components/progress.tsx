import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const progressVariants = cva('h-full rounded-full transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
      info: 'bg-info',
    },
    indeterminate: {
      true: 'w-full animate-pulse',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    indeterminate: false,
  },
});

export interface ProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof progressVariants>, 'indeterminate'> {
  value?: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  /** Accessible name for the bar; used as the default `aria-label`. */
  label?: string;
  /** Unknown progress: omits `aria-valuenow` and renders an animated full-width bar. */
  indeterminate?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      variant = 'default',
      label,
      indeterminate = false,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel ?? label}
        data-slot="progress"
        data-indeterminate={indeterminate || undefined}
        className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
        {...props}
      >
        <div
          className={cn(progressVariants({ variant, indeterminate }))}
          style={indeterminate ? undefined : { width: `${String(percentage)}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';
