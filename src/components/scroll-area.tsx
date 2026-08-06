/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- a scrollable region needs its own tab stop (WCAG 2.1.1) */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const scrollAreaVariants = cva('relative', {
  variants: {
    orientation: {
      vertical: 'overflow-y-auto overflow-x-hidden',
      horizontal: 'overflow-x-auto overflow-y-hidden',
      both: 'overflow-auto',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export interface ScrollAreaProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof scrollAreaVariants> {
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Accessible name for the scrollable region. */
  'aria-label'?: string;
  /** Keyboard-reachable so the region can be scrolled without a pointer (WCAG 2.1.1). */
  focusable?: boolean;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ orientation = 'vertical', focusable = true, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="region"
      tabIndex={focusable ? 0 : undefined}
      className={cn(
        scrollAreaVariants({ orientation }),
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className
      )}
      data-slot="scroll-area"
      {...props}
    >
      {children}
    </div>
  )
);
ScrollArea.displayName = 'ScrollArea';
