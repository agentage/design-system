import { cn } from '../lib/utils';

// The inline charts moved to ./stat-card-charts; re-exported to keep this import path.
export { Sparkline, MiniBars } from './stat-card-charts';
export type { SparklineProps, MiniBarsProps } from './stat-card-charts';

export interface BreakdownSegment {
  label: string;
  value: number;
  color?: string;
}

export interface StatBreakdownProps {
  segments: BreakdownSegment[];
  className?: string;
  showLegend?: boolean;
  /** Overrides the accessible name derived from the segments. */
  chartLabel?: string;
}

export const StatBreakdown = ({
  segments,
  className,
  showLegend = true,
  chartLabel,
}: StatBreakdownProps): React.JSX.Element => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const summary = segments.map((s) => `${s.label} ${s.value}`).join(', ');
  return (
    <div className={cn('space-y-2', className)} data-slot="stat-breakdown">
      <div
        className="flex h-2 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={chartLabel ?? `Breakdown: ${summary}`}
      >
        {segments.map((s, i) => (
          <div
            key={i}
            className={cn(s.color ?? 'bg-primary', i > 0 && 'border-l border-card')}
            style={{ width: `${(s.value / total) * 100}%` }}
            aria-label={`${s.label}: ${s.value}`}
          />
        ))}
      </div>
      {showLegend && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className={cn('size-1.5 rounded-full', s.color ?? 'bg-primary')} />
              <span>{s.label}</span>
              <span className="tabular-nums text-foreground/80">{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export interface StatProgressProps {
  current: number;
  target: number;
  format?: (n: number) => string;
  className?: string;
}

export const StatProgress = ({
  current,
  target,
  format,
  className,
}: StatProgressProps): React.JSX.Element => {
  const fmt = format ?? ((n: number) => n.toLocaleString());
  const pct = Math.min(100, (current / Math.max(target, 1)) * 100);
  return (
    <div className={cn('space-y-1', className)} data-slot="stat-progress">
      {/* Track duplicates the numbers printed below it, so it stays out of the a11y tree. */}
      <div aria-hidden="true" className="flex h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          <span className="tabular-nums text-foreground/80">{fmt(current)}</span> of {fmt(target)}
        </span>
        <span className="tabular-nums">{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
};

export interface StatComparisonProps {
  current: number;
  previous: number;
  format?: (n: number) => string;
  className?: string;
  periodLabel?: string;
}

export const StatComparison = ({
  current,
  previous,
  format,
  className,
  periodLabel = 'vs prev',
}: StatComparisonProps): React.JSX.Element => {
  const fmt = format ?? ((n: number) => n.toLocaleString());
  const delta = current - previous;
  const pct = previous === 0 ? 0 : (delta / previous) * 100;
  const up = delta >= 0;
  return (
    <div
      className={cn('flex items-baseline gap-2 text-[10px] text-muted-foreground', className)}
      data-slot="stat-comparison"
    >
      <span>
        {periodLabel} <span className="tabular-nums text-foreground/70">{fmt(previous)}</span>
      </span>
      <span
        className={cn(
          'inline-flex items-center gap-0.5 tabular-nums font-medium',
          up ? 'text-success' : 'text-destructive'
        )}
      >
        <span aria-hidden="true">{up ? '▲' : '▼'}</span>
        <span className="sr-only">{up ? 'Up' : 'Down'}</span>
        {pct.toFixed(1)}%
      </span>
    </div>
  );
};
