import { cn } from '../lib/utils';

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
  contained?: boolean;
}

export const TopBar = ({
  className,
  sticky,
  contained = true,
  children,
  ...props
}: TopBarProps): React.JSX.Element => (
  <header
    className={cn(
      'border-b border-border bg-background/95 backdrop-blur',
      sticky && 'sticky top-0 z-40',
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
);

export const TopBarBrand = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn('flex items-center gap-2 font-semibold text-foreground', className)}
    data-slot="top-bar-brand"
    {...props}
  >
    {children}
  </div>
);

export const TopBarNav = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>): React.JSX.Element => (
  <nav
    className={cn('flex flex-1 items-center gap-1', className)}
    data-slot="top-bar-nav"
    {...props}
  >
    {children}
  </nav>
);

export interface TopBarNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export const TopBarNavItem = ({
  className,
  active,
  ...props
}: TopBarNavItemProps): React.JSX.Element => (
  <a
    className={cn(
      'rounded-md px-3 py-1.5 text-sm transition-colors',
      active
        ? 'bg-accent text-foreground'
        : 'text-foreground/70 hover:bg-accent/50 hover:text-foreground',
      className
    )}
    data-slot="top-bar-nav-item"
    aria-current={active ? 'page' : undefined}
    {...props}
  />
);

export const TopBarActions = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div className={cn('flex items-center gap-2', className)} data-slot="top-bar-actions" {...props}>
    {children}
  </div>
);
