import { cn } from '../lib/utils';

export interface SparklineProps {
  data: number[];
  className?: string;
  stroke?: string;
  fill?: string;
  height?: number;
  /** Highlight the latest reading with a dot at the end of the line. */
  showLastDot?: boolean;
  /** Highlight the min and max points with small markers. */
  showMinMax?: boolean;
}

export const Sparkline = ({
  data,
  className,
  stroke = 'stroke-primary',
  fill = 'fill-primary/15',
  height = 32,
  showLastDot = false,
  showMinMax = false,
}: SparklineProps): React.JSX.Element => {
  if (data.length < 2) return <div className={cn('h-8 w-full', className)} />;
  const w = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: height - ((v - min) / range) * (height - 2) - 1,
    v,
  }));
  const pts = coords.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  const firstX = coords[0].x;
  const lastP = coords[coords.length - 1];
  const area = `M ${firstX.toFixed(2)},${height} L ${pts.replace(/ /g, ' L ')} L ${lastP.x.toFixed(2)},${height} Z`;
  const maxIdx = data.indexOf(max);
  const minIdx = data.indexOf(min);
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className={cn('h-8 w-full overflow-visible', className)}
      data-slot="sparkline"
    >
      <path d={area} className={fill} />
      <polyline points={pts} fill="none" strokeWidth="1.5" className={stroke} />
      {showMinMax && (
        <>
          <circle
            cx={coords[maxIdx].x}
            cy={coords[maxIdx].y}
            r="1.5"
            className="fill-success"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={coords[minIdx].x}
            cy={coords[minIdx].y}
            r="1.5"
            className="fill-destructive"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
      {showLastDot && (
        <circle
          cx={lastP.x}
          cy={lastP.y}
          r="1.8"
          className={cn(stroke.replace('stroke-', 'fill-'))}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
};

export interface MiniBarsProps {
  data: number[];
  className?: string;
  color?: string;
  height?: number;
}

export const MiniBars = ({
  data,
  className,
  color = 'fill-primary',
  height = 32,
}: MiniBarsProps): React.JSX.Element => {
  const max = Math.max(...data) || 1;
  const bw = 100 / data.length;
  const gap = bw * 0.2;
  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className={cn('h-8 w-full', className)}
      data-slot="mini-bars"
    >
      {data.map((v, i) => {
        const h = (v / max) * (height - 2);
        return (
          <rect
            key={i}
            x={i * bw + gap / 2}
            y={height - h}
            width={bw - gap}
            height={Math.max(h, 1)}
            rx="0.5"
            className={cn(color, 'opacity-85')}
          />
        );
      })}
    </svg>
  );
};

export interface BreakdownSegment {
  label: string;
  value: number;
  color?: string;
}

export interface StatBreakdownProps {
  segments: BreakdownSegment[];
  className?: string;
  showLegend?: boolean;
}

export const StatBreakdown = ({
  segments,
  className,
  showLegend = true,
}: StatBreakdownProps): React.JSX.Element => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className={cn('space-y-2', className)} data-slot="stat-breakdown">
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
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
      <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
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
        {pct.toFixed(1)}%
      </span>
    </div>
  );
};
