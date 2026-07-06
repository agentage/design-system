import { cn } from '../lib/utils';
import { CARD_BASE, TITLE, DESC } from './card-base';

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
