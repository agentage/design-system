import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const pageHeaderActionVariants = cva(
  [
    'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:bg-accent hover:text-foreground',
        success: 'text-success hover:bg-success/10',
        warning: 'text-warning hover:bg-warning/10',
        destructive: 'text-destructive hover:bg-destructive/10',
        info: 'text-info hover:bg-info/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface PageHeaderAction {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  variant?: NonNullable<VariantProps<typeof pageHeaderActionVariants>['variant']>;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: PageHeaderAction[];
}

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ icon, title, subtitle, actions, children, className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn('flex items-center justify-between gap-3 h-[52px]', className)}
      data-slot="page-header"
      {...props}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-3.5"
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {actions?.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            title={action.title}
            className={cn(pageHeaderActionVariants({ variant: action.variant }))}
          >
            <span aria-hidden="true" className="[&_svg]:size-4">
              {action.icon}
            </span>
            {action.title}
          </button>
        ))}
        {children}
      </div>
    </header>
  )
);
PageHeader.displayName = 'PageHeader';
