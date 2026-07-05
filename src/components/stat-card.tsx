import { cn } from '../lib/utils';

export interface StatCardTrend {
  value: string;
  up: boolean;
}

export interface StatCardProps {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  value: string | number;
  trend?: StatCardTrend;
  description?: React.ReactNode;
  className?: string;
}

const TrendIcon = (): React.JSX.Element => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const StatCard = ({
  icon,
  iconColor,
  title,
  value,
  trend,
  description,
  className,
}: StatCardProps): React.JSX.Element => (
  <div
    className={cn(
      'rounded-lg border border-border bg-sidebar p-5 transition-[transform,box-shadow,border-color] duration-[140ms] hover:-translate-y-[3px] hover:border-muted-foreground hover:shadow-md',
      className
    )}
    data-slot="stat-card"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-md [&_svg]:size-4',
              iconColor ?? 'bg-primary-soft text-primary'
            )}
          >
            {icon}
          </div>
        )}
        <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
          {title}
        </div>
      </div>
      {trend && (
        <div
          className={cn(
            'flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium border border-border bg-muted/30',
            trend.up ? 'text-success' : 'text-destructive'
          )}
        >
          <TrendIcon />
          <span>{trend.value}</span>
        </div>
      )}
    </div>
    <div className="space-y-2">
      <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
  </div>
);
