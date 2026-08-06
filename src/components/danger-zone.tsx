import * as React from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

export interface DangerZoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Heading of the region, default `Danger zone`. */
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}

/** Destructive-bordered region for irreversible settings actions. */
export const DangerZone = React.forwardRef<HTMLDivElement, DangerZoneProps>(
  (
    {
      title = 'Danger zone',
      description,
      children,
      className,
      'aria-label': ariaLabel = 'Danger zone',
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      role="region"
      aria-label={ariaLabel}
      data-slot="danger-zone"
      className={cn('gap-4 border-destructive/40', className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-destructive">{title}</CardTitle>
        {description && <CardDescription className="col-start-1">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="divide-y divide-border border-t border-border pt-0">
        {children}
      </CardContent>
    </Card>
  )
);
DangerZone.displayName = 'DangerZone';

export interface DangerZoneActionProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Trailing slot — the destructive button or a `ConfirmByTyping` trigger. */
  action: React.ReactNode;
}

export const DangerZoneAction = React.forwardRef<HTMLDivElement, DangerZoneActionProps>(
  ({ label, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="danger-zone-action"
      className={cn('flex flex-wrap items-center justify-between gap-4 py-4', className)}
      {...props}
    >
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
);
DangerZoneAction.displayName = 'DangerZoneAction';
