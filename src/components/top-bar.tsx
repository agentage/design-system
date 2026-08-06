import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const topBarVariants = cva('border-b border-border bg-background/95 backdrop-blur', {
  variants: {
    sticky: {
      true: 'sticky top-0 z-[var(--z-sticky,40)]',
      false: '',
    },
  },
  defaultVariants: {
    sticky: false,
  },
});

// Empty cva base keeps the width class ahead of the layout classes, so the merged string is unchanged.
const topBarInnerVariants = cva('', {
  variants: {
    contained: {
      true: 'mx-auto max-w-6xl',
      false: 'w-full',
    },
  },
  defaultVariants: {
    contained: true,
  },
});

export interface TopBarProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof topBarVariants> {
  sticky?: boolean;
  contained?: boolean;
}

export const TopBar = React.forwardRef<HTMLElement, TopBarProps>(
  ({ className, sticky, contained = true, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(topBarVariants({ sticky: !!sticky }), className)}
      data-slot="top-bar"
      {...props}
    >
      <div className={cn(topBarInnerVariants({ contained }), 'flex h-14 items-center gap-6 px-6')}>
        {children}
      </div>
    </header>
  )
);
TopBar.displayName = 'TopBar';

export const TopBarBrand = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 font-semibold text-foreground', className)}
      data-slot="top-bar-brand"
      {...props}
    >
      {children}
    </div>
  )
);
TopBarBrand.displayName = 'TopBarBrand';

export const TopBarNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('flex flex-1 items-center gap-1', className)}
      data-slot="top-bar-nav"
      {...props}
    >
      {children}
    </nav>
  )
);
TopBarNav.displayName = 'TopBarNav';

export const topBarNavItemVariants = cva(
  [
    'rounded-md px-3 py-1.5 text-sm transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  ],
  {
    variants: {
      active: {
        true: 'bg-accent text-foreground',
        false: 'text-foreground/70 hover:bg-accent/50 hover:text-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export interface TopBarNavItemProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof topBarNavItemVariants> {
  active?: boolean;
}

export const TopBarNavItem = React.forwardRef<HTMLAnchorElement, TopBarNavItemProps>(
  ({ className, active, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(topBarNavItemVariants({ active: !!active }), className)}
      data-slot="top-bar-nav-item"
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  )
);
TopBarNavItem.displayName = 'TopBarNavItem';

export const TopBarActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      data-slot="top-bar-actions"
      {...props}
    >
      {children}
    </div>
  )
);
TopBarActions.displayName = 'TopBarActions';
