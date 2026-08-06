import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof separatorVariants> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = 'horizontal', decorative = true, className, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-slot="separator"
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  )
);
Separator.displayName = 'Separator';
