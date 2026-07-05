import { cn } from '../lib/utils';

const CARD_BASE = 'rounded-lg border border-border bg-sidebar p-4';
const TITLE = 'text-xs text-muted-foreground';
const DESC = 'text-xs text-muted-foreground mt-3';

/* ============================================================================
 * GaugeCard — semicircle gauge w/ optional threshold zones
 * Use when threshold/utilization matters (capacity, error rate, latency).
 * ========================================================================= */

export interface GaugeCardProps {
  title: string;
  value: number;
  min?: number;
  max?: number;
  thresholds?: { warning: number; critical: number };
  format?: (n: number) => string;
  description?: React.ReactNode;
  className?: string;
}

export const GaugeCard = ({
  title,
  value,
  min = 0,
  max = 100,
  thresholds,
  format,
  description,
  className,
}: GaugeCardProps): React.JSX.Element => {
  const fmt = format ?? ((n: number) => n.toLocaleString());
  const clamped = Math.max(min, Math.min(max, value));
  const pct = (clamped - min) / Math.max(max - min, 1);
  const angle = -Math.PI + pct * Math.PI;
  const cx = 60;
  const cy = 55;
  const r = 42;
  const nx = cx + r * Math.cos(angle);
  const ny = cy + r * Math.sin(angle);
  const warnP = thresholds ? (thresholds.warning - min) / Math.max(max - min, 1) : 1;
  const critP = thresholds ? (thresholds.critical - min) / Math.max(max - min, 1) : 1;
  const arc = (a0: number, a1: number): string => {
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  const segments = thresholds
    ? [
        { d: arc(-Math.PI, -Math.PI + warnP * Math.PI), c: 'var(--color-success)' },
        {
          d: arc(-Math.PI + warnP * Math.PI, -Math.PI + critP * Math.PI),
          c: 'var(--color-warning)',
        },
        { d: arc(-Math.PI + critP * Math.PI, 0), c: 'var(--color-destructive)' },
      ]
    : [{ d: arc(-Math.PI, 0), c: 'var(--color-primary)' }];
  return (
    <div className={cn(CARD_BASE, className)} data-slot="gauge-card">
      <div className={TITLE}>{title}</div>
      <svg viewBox="0 0 120 70" className="mt-1 h-20 w-full" aria-label={`gauge ${value}`}>
        {segments.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke={s.c} strokeWidth="8" strokeLinecap="round" />
        ))}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground"
        />
        <circle cx={cx} cy={cy} r="3" fill="currentColor" className="text-foreground" />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-semibold tabular-nums text-foreground">{fmt(value)}</div>
        {description && <div className="mt-1 text-xs text-muted-foreground">{description}</div>}
      </div>
    </div>
  );
};

/* ============================================================================
 * DonutCard — donut chart for part-of-whole
 * Use when showing composition (storage breakdown, traffic source mix).
 * ========================================================================= */

export interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutCardProps {
  title: string;
  segments: DonutSegment[];
  total?: number;
  centerLabel?: React.ReactNode;
  centerSubLabel?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export const DonutCard = ({
  title,
  segments,
  total,
  centerLabel,
  centerSubLabel,
  description,
  className,
}: DonutCardProps): React.JSX.Element => {
  const sum = total ?? (segments.reduce((s, x) => s + x.value, 0) || 1);
  const r = 18;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className={cn(CARD_BASE, className)} data-slot="donut-card">
      <div className={TITLE}>{title}</div>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative size-24 shrink-0">
          <svg viewBox="0 0 50 50" className="-rotate-90 size-24">
            <circle cx="25" cy="25" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="6" />
            {segments.map((s, i) => {
              const length = (s.value / sum) * c;
              const dash = `${length} ${c - length}`;
              const dashOffset = -offset;
              offset += length;
              return (
                <circle
                  key={i}
                  cx="25"
                  cy="25"
                  r={r}
                  fill="none"
                  stroke={s.color ?? 'var(--color-primary)'}
                  strokeWidth="6"
                  strokeDasharray={dash}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </svg>
          {(centerLabel || centerSubLabel) && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
              {centerLabel && (
                <div className="text-sm font-semibold leading-tight tabular-nums text-foreground">
                  {centerLabel}
                </div>
              )}
              {centerSubLabel && (
                <div className="text-[9px] leading-tight text-muted-foreground">
                  {centerSubLabel}
                </div>
              )}
            </div>
          )}
        </div>
        <ul className="flex-1 space-y-1">
          {segments.map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span
                className="size-2 rounded-sm"
                style={{ background: s.color ?? 'var(--color-primary)' }}
              />
              <span className="text-muted-foreground">{s.label}</span>
              <span className="ml-auto tabular-nums text-foreground/80">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
      {description && <div className={DESC}>{description}</div>}
    </div>
  );
};

/* ============================================================================
 * ScoreCard — 0..max score with optional colored bands (NPS, CSAT, health).
 * ========================================================================= */

export interface ScoreBand {
  label: string;
  from: number;
  to: number;
  color: string;
}

export interface ScoreCardProps {
  title: string;
  score: number;
  max?: number;
  bands?: ScoreBand[];
  description?: React.ReactNode;
  className?: string;
}

export const ScoreCard = ({
  title,
  score,
  max = 100,
  bands,
  description,
  className,
}: ScoreCardProps): React.JSX.Element => {
  const current = bands?.find((b) => score >= b.from && score <= b.to);
  const pct = Math.max(0, Math.min(100, (score / Math.max(max, 1)) * 100));
  return (
    <div className={cn(CARD_BASE, className)} data-slot="score-card">
      <div className={TITLE}>{title}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-3xl font-semibold tabular-nums text-foreground">{score}</div>
        <div className="text-xs text-muted-foreground">/ {max}</div>
        {current && (
          <span
            className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              background: `color-mix(in oklch, ${current.color} 20%, transparent)`,
              color: current.color,
            }}
          >
            {current.label}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="relative flex h-1.5 overflow-hidden rounded-full bg-muted">
          {bands?.map((b, i) => {
            const left = (b.from / max) * 100;
            const width = ((b.to - b.from) / max) * 100;
            return (
              <span
                key={i}
                className="absolute h-full"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: `color-mix(in oklch, ${b.color} 35%, transparent)`,
                }}
              />
            );
          })}
          <span
            className="absolute top-1/2 h-3 w-1 rounded bg-foreground"
            style={{ left: `${pct}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] tabular-nums text-muted-foreground">
          <span>0</span>
          <span>{max}</span>
        </div>
      </div>
      {description && <div className={DESC}>{description}</div>}
    </div>
  );
};

/* ============================================================================
 * FunnelCard — vertical conversion funnel with per-stage drop-off %.
 * ========================================================================= */

export interface FunnelStage {
  label: string;
  value: number;
}

export interface FunnelCardProps {
  title: string;
  stages: FunnelStage[];
  format?: (n: number) => string;
  description?: React.ReactNode;
  className?: string;
}

export const FunnelCard = ({
  title,
  stages,
  format,
  description,
  className,
}: FunnelCardProps): React.JSX.Element => {
  const fmt = format ?? ((n: number) => n.toLocaleString());
  const max = stages[0]?.value || 1;
  return (
    <div className={cn(CARD_BASE, className)} data-slot="funnel-card">
      <div className={TITLE}>{title}</div>
      <div className="mt-3 space-y-1.5">
        {stages.map((s, i) => {
          const w = Math.max(2, (s.value / max) * 100);
          const conv =
            i > 0 && stages[i - 1].value > 0
              ? ((s.value / stages[i - 1].value) * 100).toFixed(0)
              : null;
          return (
            <div key={s.label}>
              {conv && (
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="w-2/5 shrink-0" />
                  <span>↓ {conv}%</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="w-2/5 shrink-0 truncate text-xs text-foreground" title={s.label}>
                  {s.label}
                </span>
                <div className="relative h-5 flex-1 overflow-hidden rounded bg-muted/40">
                  <div
                    className="h-full rounded bg-primary/70 transition-[width]"
                    style={{ width: `${w}%` }}
                    aria-label={`${s.label}: ${s.value}`}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {fmt(s.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {description && <div className={DESC}>{description}</div>}
    </div>
  );
};

/* ============================================================================
 * HeatmapCard — grid with intensity colors. Activity-by-day-hour, cohorts.
 * ========================================================================= */

export interface HeatmapCardProps {
  title: string;
  data: number[][];
  rowLabels?: string[];
  colLabels?: string[];
  max?: number;
  color?: string;
  description?: React.ReactNode;
  className?: string;
}

export const HeatmapCard = ({
  title,
  data,
  rowLabels,
  colLabels,
  max: maxProp,
  color = 'var(--color-primary)',
  description,
  className,
}: HeatmapCardProps): React.JSX.Element => {
  const max = maxProp ?? (Math.max(...data.flat()) || 1);
  return (
    <div className={cn(CARD_BASE, className)} data-slot="heatmap-card">
      <div className={TITLE}>{title}</div>
      <div className="mt-3 overflow-x-auto">
        <table className="border-separate" style={{ borderSpacing: 2 }}>
          {colLabels && (
            <thead>
              <tr>
                {rowLabels && <th />}
                {colLabels.map((c) => (
                  <th key={c} className="pb-1 text-[10px] font-normal text-muted-foreground">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {rowLabels && (
                  <td className="pr-2 text-right text-[10px] text-muted-foreground">
                    {rowLabels[i]}
                  </td>
                )}
                {row.map((v, j) => {
                  const intensity = Math.max(5, (v / max) * 100);
                  return (
                    <td key={j}>
                      <div
                        className="size-4 rounded-sm"
                        style={{
                          background: `color-mix(in oklch, ${color} ${intensity}%, transparent)`,
                        }}
                        title={`${rowLabels?.[i] ?? ''} ${colLabels?.[j] ?? ''}: ${v}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {description && <div className={DESC}>{description}</div>}
    </div>
  );
};

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

/* ============================================================================
 * RankedListCard — top-N list with rank, optional icon, value.
 * ========================================================================= */

export interface RankedItem {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  hint?: string;
}

export interface RankedListCardProps {
  title: string;
  items: RankedItem[];
  format?: (n: number | string) => string;
  description?: React.ReactNode;
  className?: string;
}

export const RankedListCard = ({
  title,
  items,
  format,
  description,
  className,
}: RankedListCardProps): React.JSX.Element => {
  const fmt = format ?? ((n: number | string) => String(n));
  return (
    <div className={cn(CARD_BASE, className)} data-slot="ranked-list-card">
      <div className={TITLE}>{title}</div>
      <ol className="mt-3 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3 text-xs">
            <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold tabular-nums text-foreground">
              {i + 1}
            </span>
            {it.icon && <span className="text-muted-foreground [&_svg]:size-4">{it.icon}</span>}
            <span className="flex-1 truncate text-foreground">{it.label}</span>
            {it.hint && <span className="text-[10px] text-muted-foreground">{it.hint}</span>}
            <span className="tabular-nums text-muted-foreground">{fmt(it.value)}</span>
          </li>
        ))}
      </ol>
      {description && <div className={DESC}>{description}</div>}
    </div>
  );
};
