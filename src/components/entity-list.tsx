import * as React from 'react';
import { cn } from '../lib/utils';

export type EntityListProps = React.HTMLAttributes<HTMLDivElement>;

export const EntityList = React.forwardRef<HTMLDivElement, EntityListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'divide-y divide-border overflow-hidden rounded-lg border border-border bg-background',
        className
      )}
      data-slot="entity-list"
      {...props}
    />
  )
);
EntityList.displayName = 'EntityList';

export interface ListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  href?: string;
  target?: string;
  rel?: string;
  leading?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}

export const ListRow = React.forwardRef<HTMLDivElement, ListRowProps>(
  (
    {
      href,
      target,
      rel,
      leading,
      title,
      description,
      meta,
      actions,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center gap-3 px-4 py-3 transition-colors duration-[140ms] hover:bg-accent/50',
        className
      )}
      data-slot="list-row"
      {...props}
    >
      {leading && <span className="flex shrink-0 items-center [&_svg]:size-4">{leading}</span>}
      <div className="min-w-0 flex-1">
        {title !== undefined &&
          (href ? (
            // Pseudo-element overlay keeps the whole row clickable without nesting actions in the link.
            <a
              href={href}
              target={target}
              rel={rel}
              className="block truncate text-sm font-medium text-foreground after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              data-slot="list-row-link"
            >
              {title}
            </a>
          ) : (
            <span className="block truncate text-sm font-medium text-foreground">{title}</span>
          ))}
        {description && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{description}</span>
        )}
        {children}
      </div>
      {(meta || actions) && (
        <div className="flex shrink-0 items-center gap-2">
          {meta && <span className="whitespace-nowrap text-xs text-muted-foreground">{meta}</span>}
          {actions && <span className="relative z-10 flex items-center">{actions}</span>}
        </div>
      )}
    </div>
  )
);
ListRow.displayName = 'ListRow';
