import * as React from 'react';
import { cn } from '../lib/utils';
import { CARD_BASE, TITLE, DESC } from './card-base';

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
  /** Overrides the screen-reader table caption (defaults to title). */
  chartLabel?: string;
}

export const HeatmapCard = React.forwardRef<HTMLDivElement, HeatmapCardProps>(
  (
    {
      title,
      data,
      rowLabels,
      colLabels,
      max: maxProp,
      color = 'var(--color-primary)',
      description,
      className,
      chartLabel,
    },
    ref
  ) => {
    const max = maxProp ?? (Math.max(...data.flat()) || 1);
    return (
      <div ref={ref} className={cn(CARD_BASE, className)} data-slot="heatmap-card">
        <div className={TITLE}>{title}</div>
        <div className="mt-3 overflow-x-auto">
          <table className="border-separate" style={{ borderSpacing: 2 }}>
            <caption className="sr-only">{chartLabel ?? title}</caption>
            {colLabels && (
              <thead>
                <tr>
                  {rowLabels && <td />}
                  {colLabels.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="pb-1 text-[10px] font-normal text-muted-foreground"
                    >
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
                    <th
                      scope="row"
                      className="pr-2 text-right text-[10px] font-normal text-muted-foreground"
                    >
                      {rowLabels[i]}
                    </th>
                  )}
                  {row.map((v, j) => {
                    const intensity = Math.max(5, (v / max) * 100);
                    return (
                      <td key={j}>
                        <span className="sr-only">{v}</span>
                        <div
                          aria-hidden="true"
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
  }
);
HeatmapCard.displayName = 'HeatmapCard';
