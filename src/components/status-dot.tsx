import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const statusDotVariants = cva('inline-block shrink-0 rounded-full', {
  variants: {
    variant: {
      online: 'bg-success',
      offline: 'bg-muted-foreground',
      working: 'bg-success animate-pulse',
      error: 'bg-destructive',
      warning: 'bg-warning',
      info: 'bg-info',
      pending: 'bg-muted-foreground animate-pulse',
      default: 'bg-muted-foreground',
      primary: 'bg-primary',
      success: 'bg-success',
      destructive: 'bg-destructive',
    },
    size: {
      sm: 'size-1.5',
      md: 'size-2',
      lg: 'size-2.5',
    },
  },
  defaultVariants: {
    variant: 'offline',
    size: 'md',
  },
});

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusDotVariants> {
  label?: string;
}

export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ variant, size, label, className, 'aria-label': ariaLabel, ...props }, ref) => {
    const name = label ? ariaLabel : (ariaLabel ?? String(variant));

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center gap-1.5', label && 'text-sm', className)}
        data-slot="status-dot"
        aria-label={name}
        // aria-label is prohibited on a generic span; role=img gives it a home.
        role={name ? 'img' : undefined}
        {...props}
      >
        <span className={cn(statusDotVariants({ variant, size }))} aria-hidden="true" />
        {label && <span className="text-muted-foreground leading-none">{label}</span>}
      </span>
    );
  }
);
StatusDot.displayName = 'StatusDot';
