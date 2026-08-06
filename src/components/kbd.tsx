import * as React from 'react';
import { cn } from '../lib/utils';

export type KbdProps = React.HTMLAttributes<HTMLElement>;

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    className={cn(
      'inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-2xs font-medium text-muted-foreground',
      className
    )}
    data-slot="kbd"
    {...props}
  />
));
Kbd.displayName = 'Kbd';
