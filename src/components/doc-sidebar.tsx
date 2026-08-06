import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const docSidebarItemVariants = cva(
  [
    'block rounded-md px-2 py-1 text-sm transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  ],
  {
    variants: {
      indented: {
        true: 'border-l border-border',
        false: '',
      },
      active: {
        true: 'bg-primary/10 font-medium text-primary',
        false: 'text-foreground/70 hover:bg-accent hover:text-foreground',
      },
    },
    defaultVariants: {
      indented: false,
      active: false,
    },
  }
);

export interface DocSidebarProps extends React.HTMLAttributes<HTMLElement> {
  width?: string;
}

export const DocSidebar = React.forwardRef<HTMLElement, DocSidebarProps>(
  ({ className, width = 'w-60', children, ...props }, ref) => (
    <aside
      ref={ref}
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
  )
);
DocSidebar.displayName = 'DocSidebar';

export interface DocSidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const DocSidebarGroup = React.forwardRef<HTMLDivElement, DocSidebarGroupProps>(
  ({ title, className, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} data-slot="doc-sidebar-group" {...props}>
      <div className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="space-y-px">{children}</div>
    </div>
  )
);
DocSidebarGroup.displayName = 'DocSidebarGroup';

export interface DocSidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  depth?: number;
}

export const DocSidebarItem = React.forwardRef<HTMLAnchorElement, DocSidebarItemProps>(
  ({ active, depth = 0, className, style, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(docSidebarItemVariants({ indented: depth > 0, active: !!active }), className)}
      style={depth > 0 ? { ...style, paddingLeft: `${0.5 + depth * 0.75}rem` } : style}
      data-slot="doc-sidebar-item"
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  )
);
DocSidebarItem.displayName = 'DocSidebarItem';
