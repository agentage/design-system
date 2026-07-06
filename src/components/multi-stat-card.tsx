import { cn } from '../lib/utils';
import { CARD_BASE, TITLE, DESC } from './card-base';

/* ============================================================================
 * MultiStatCard — multiple stats side-by-side w/ shared header & dividers.
 * ========================================================================= */

export interface MultiStat {
  label: string;
  value: string | number;
  trend?: { value: string; up: boolean };
}

export interface MultiStatCardProps {
  title: string;
  stats: MultiStat[];
  description?: React.ReactNode;
  className?: string;
}

export const MultiStatCard = ({
  title,
  stats,
  description,
  className,
}: MultiStatCardProps): React.JSX.Element => (
  <div className={cn(CARD_BASE, className)} data-slot="multi-stat-card">
    <div className={TITLE}>{title}</div>
    <div
      className="mt-3 grid gap-3"
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((s, i) => (
        <div key={i} className={cn(i > 0 && 'border-l border-border pl-3')}>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
          <div className="text-lg font-semibold tabular-nums text-foreground">{s.value}</div>
          {s.trend && (
            <div
              className={cn(
                'text-[10px] tabular-nums',
                s.trend.up ? 'text-success' : 'text-destructive'
              )}
            >
              {s.trend.up ? '▲' : '▼'} {s.trend.value}
            </div>
          )}
        </div>
      ))}
    </div>
    {description && <div className={DESC}>{description}</div>}
  </div>
);
