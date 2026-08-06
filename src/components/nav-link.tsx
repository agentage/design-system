import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const navLinkVariants = cva(
  [
    'flex items-center gap-3 rounded-md border-l-[3px] border-l-transparent px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-[140ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  ],
  {
    variants: {
      active: {
        true: 'border-l-primary bg-primary-soft text-foreground',
        false: 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export interface NavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof navLinkVariants> {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  /** Render the child element (e.g. next/link) instead of an `<a>`. */
  asChild?: boolean;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ active = false, icon, badge, asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';

    return (
      <Comp
        ref={ref}
        data-slot="nav-link"
        data-active={active || undefined}
        aria-current={active ? 'page' : undefined}
        className={cn(navLinkVariants({ active }), className)}
        {...props}
      >
        {icon && <span className="shrink-0 [&_svg]:size-4">{icon}</span>}
        {asChild ? (
          // Slottable keeps icon/badge as siblings inside the consumer's element.
          <Slottable>{children}</Slottable>
        ) : (
          <span className="flex-1 truncate">{children}</span>
        )}
        {badge && <span className="shrink-0">{badge}</span>}
      </Comp>
    );
  }
);
NavLink.displayName = 'NavLink';
