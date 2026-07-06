import { cn } from '../lib/utils';
import { CARD_BASE, TITLE } from './card-base';

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
