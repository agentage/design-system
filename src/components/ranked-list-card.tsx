import { cn } from '../lib/utils';
import { CARD_BASE, TITLE, DESC } from './card-base';

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
