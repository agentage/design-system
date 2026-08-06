import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { CARD_BASE, TITLE, DESC } from './card-base';
import { TREND_TONE, type StatCardTrend } from './stat-card';

/* ============================================================================
 * MultiStatCard — multiple stats side-by-side w/ shared header & dividers.
 * ========================================================================= */

export const multiStatTrendVariants = cva('text-2xs tabular-nums', {
  variants: { tone: TREND_TONE },
  defaultVariants: { tone: 'up' },
});

export interface MultiStat {
  label: string;
  value: string | number;
  trend?: StatCardTrend;
}

export interface MultiStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  stats: MultiStat[];
  description?: React.ReactNode;
}

export const MultiStatCard = React.forwardRef<HTMLDivElement, MultiStatCardProps>(
  ({ title, stats, description, className, ...props }, ref) => (
    <div ref={ref} className={cn(CARD_BASE, className)} data-slot="multi-stat-card" {...props}>
      <div className={TITLE}>{title}</div>
      <div
        className="mt-3 grid gap-3"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((s, i) => (
          <div key={i} className={cn(i > 0 && 'border-l border-border pl-3')}>
            <div className="text-2xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="text-lg font-semibold tabular-nums text-foreground">{s.value}</div>
            {s.trend && (
              <div
                className={cn(
                  multiStatTrendVariants({ tone: s.trend.tone ?? (s.trend.up ? 'up' : 'down') })
                )}
              >
                <span aria-hidden="true">{s.trend.up ? '▲' : '▼'}</span>
                <span className="sr-only">{s.trend.up ? 'Up' : 'Down'}</span> {s.trend.value}
              </div>
            )}
          </div>
        ))}
      </div>
      {description && <div className={DESC}>{description}</div>}
    </div>
  )
);
MultiStatCard.displayName = 'MultiStatCard';
