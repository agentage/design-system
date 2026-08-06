import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const iconContainerVariants = cva('flex items-center justify-center rounded-md', {
  variants: {
    color: {
      blue: 'bg-blue-500/10 text-blue-500',
      green: 'bg-green-500/10 text-green-500',
      amber: 'bg-amber-500/10 text-amber-500',
      violet: 'bg-violet-500/10 text-violet-500',
      rose: 'bg-rose-500/10 text-rose-500',
      cyan: 'bg-cyan-500/10 text-cyan-500',
      muted: 'bg-muted/50 text-muted-foreground',
      default: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      destructive: 'bg-destructive/10 text-destructive',
      info: 'bg-info/10 text-info',
    },
    size: {
      sm: 'size-6',
      md: 'size-8',
      lg: 'size-10',
    },
  },
  defaultVariants: {
    color: 'muted',
    size: 'md',
  },
});

export type IconContainerColor = NonNullable<VariantProps<typeof iconContainerVariants>['color']>;

export type IconContainerSize = NonNullable<VariantProps<typeof iconContainerVariants>['size']>;

export interface IconContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  color: IconContainerColor;
  size?: IconContainerSize;
  children: React.ReactNode;
}

export const IconContainer = React.forwardRef<HTMLDivElement, IconContainerProps>(
  ({ color, size, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(iconContainerVariants({ color, size }), className)}
      data-slot="icon-container"
      {...props}
    >
      {children}
    </div>
  )
);
IconContainer.displayName = 'IconContainer';
