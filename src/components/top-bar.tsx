import * as React from 'react';
import { cn } from '../lib/utils';

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
  contained?: boolean;
}

export const TopBar = React.forwardRef<HTMLElement, TopBarProps>(
  ({ className, sticky, contained = true, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'border-b border-border bg-background/95 backdrop-blur',
        sticky && 'sticky top-0 z-[var(--z-sticky,40)]',
        className
      )}
      data-slot="top-bar"
      {...props}
    >
      <div
        className={cn(
          contained ? 'mx-auto max-w-6xl' : 'w-full',
          'flex h-14 items-center gap-6 px-6'
        )}
      >
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

export interface TopBarNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export const TopBarNavItem = React.forwardRef<HTMLAnchorElement, TopBarNavItemProps>(
  ({ className, active, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        active
          ? 'bg-accent text-foreground'
          : 'text-foreground/70 hover:bg-accent/50 hover:text-foreground',
        className
      )}
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
