import { cn } from '../lib/utils';
import { CARD_BASE, TITLE, DESC } from './card-base';

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
