import * as React from 'react';
import { cn } from '../lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ icon, iconColor, title, description, action, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-sidebar p-4', className)}
      data-slot="section"
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              aria-hidden="true"
              className={cn(
                'flex size-8 items-center justify-center rounded-md [&_svg]:size-4',
                iconColor ?? 'bg-primary/10 text-primary-emphasis'
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-foreground">{title}</div>
            {description && <div className="text-xs text-muted-foreground">{description}</div>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
);
Section.displayName = 'Section';
