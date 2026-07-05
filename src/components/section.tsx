import { cn } from '../lib/utils';

export interface SectionProps {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Section = ({
  icon,
  iconColor,
  title,
  description,
  action,
  children,
  className,
}: SectionProps): React.JSX.Element => (
  <div
    className={cn('rounded-lg border border-border bg-sidebar p-4', className)}
    data-slot="section"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-md [&_svg]:size-4',
              iconColor ?? 'bg-primary/10 text-primary'
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
);
