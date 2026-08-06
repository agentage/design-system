import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const spinnerVariants = cva('animate-spin text-primary-emphasis', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface SpinnerProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'size'>, VariantProps<typeof spinnerVariants> {
  'aria-label'?: string;
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size, className, 'aria-label': ariaLabel = 'Loading', ...props }, ref) => (
    <svg
      ref={ref}
      role="status"
      aria-label={ariaLabel}
      data-slot="spinner"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-20"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
);
Spinner.displayName = 'Spinner';
