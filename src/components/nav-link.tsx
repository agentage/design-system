import { cn } from '../lib/utils';

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const NavLink = ({
  active = false,
  icon,
  badge,
  className,
  children,
  ...props
}: NavLinkProps): React.JSX.Element => (
  <a
    data-slot="nav-link"
    data-active={active || undefined}
    className={cn(
      'flex items-center gap-3 rounded-md border-l-[3px] border-l-transparent px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-[140ms]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      active
        ? 'border-l-primary bg-primary-soft text-foreground'
        : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
      className
    )}
    {...props}
  >
    {icon && <span className="shrink-0 [&_svg]:size-4">{icon}</span>}
    <span className="flex-1 truncate">{children}</span>
    {badge && <span className="shrink-0">{badge}</span>}
  </a>
);
