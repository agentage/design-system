import { cn } from '../lib/utils';

export interface DocSidebarProps extends React.HTMLAttributes<HTMLElement> {
  width?: string;
}

export const DocSidebar = ({
  className,
  width = 'w-60',
  children,
  ...props
}: DocSidebarProps): React.JSX.Element => (
  <aside
    className={cn(
      width,
      'shrink-0 border-r border-border bg-sidebar text-sidebar-foreground',
      className
    )}
    data-slot="doc-sidebar"
    {...props}
  >
    <div className="sticky top-0 max-h-screen overflow-y-auto p-4">{children}</div>
  </aside>
);

export interface DocSidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const DocSidebarGroup = ({
  title,
  className,
  children,
  ...props
}: DocSidebarGroupProps): React.JSX.Element => (
  <div className={cn('mb-4', className)} data-slot="doc-sidebar-group" {...props}>
    <div className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </div>
    <div className="space-y-px">{children}</div>
  </div>
);

export interface DocSidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  depth?: number;
}

export const DocSidebarItem = ({
  active,
  depth = 0,
  className,
  style,
  ...props
}: DocSidebarItemProps): React.JSX.Element => (
  <a
    className={cn(
      'block rounded-md px-2 py-1 text-sm transition-colors',
      depth > 0 && 'border-l border-border',
      active
        ? 'bg-primary/10 font-medium text-primary'
        : 'text-foreground/70 hover:bg-accent hover:text-foreground',
      className
    )}
    style={depth > 0 ? { ...style, paddingLeft: `${0.5 + depth * 0.75}rem` } : style}
    data-slot="doc-sidebar-item"
    aria-current={active ? 'page' : undefined}
    {...props}
  />
);
