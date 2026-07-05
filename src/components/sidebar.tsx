import { cn } from '../lib/utils';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  width?: string;
}

export const Sidebar = ({
  className,
  width = 'w-60',
  children,
  ...props
}: SidebarProps): React.JSX.Element => (
  <aside
    className={cn(
      'flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
      width,
      className
    )}
    data-slot="sidebar"
    {...props}
  >
    {children}
  </aside>
);

export const SidebarHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn('flex items-center gap-2 px-4 py-4 border-b border-sidebar-border', className)}
    data-slot="sidebar-header"
    {...props}
  />
);

export const SidebarContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn('flex-1 overflow-y-auto py-2', className)}
    data-slot="sidebar-content"
    {...props}
  />
);

export const SidebarFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn('border-t border-sidebar-border px-4 py-3', className)}
    data-slot="sidebar-footer"
    {...props}
  />
);

export const SidebarGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div className={cn('px-2 py-2', className)} data-slot="sidebar-group" {...props} />
);

export const SidebarGroupLabel = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn(
      'px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider',
      className
    )}
    data-slot="sidebar-group-label"
    {...props}
  />
);
