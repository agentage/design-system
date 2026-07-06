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
