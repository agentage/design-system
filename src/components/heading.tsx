import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export const headingVariants = cva('', {
  variants: {
    as: {
      h1: 'text-3xl font-bold tracking-[-0.02em]',
      h2: 'text-xl font-semibold tracking-[-0.02em]',
      h3: 'text-lg font-semibold',
      h4: 'text-sm font-semibold',
    },
  },
  defaultVariants: {
    as: 'h2',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: HeadingLevel;
  description?: string;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = 'h2', description, className, children, ...props }, ref) => (
    <div data-slot="heading">
      <Tag
        ref={ref}
        className={cn(headingVariants({ as: Tag }), 'text-foreground', className)}
        {...props}
      >
        {children}
      </Tag>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
);
Heading.displayName = 'Heading';
