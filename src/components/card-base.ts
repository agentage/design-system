import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Two card surfaces exist today and both ship as-is:
 *
 * - `panel` (CARD_BASE) — bg-sidebar, rounded-lg, p-4. The dense metric/chart
 *   cards (gauge, donut, score, heatmap, funnel, ranked-list, multi-stat).
 * - `card` — bg-card, rounded-xl, py-6 + shadow. The `Card` composition in
 *   card.tsx, with padding supplied per slot.
 *
 * Converging them is a deliberate visual change, deferred to wave 3. Until
 * then this CVA is the single place both are declared.
 */
export const cardSurface = cva('border border-border', {
  variants: {
    surface: {
      panel: 'rounded-lg bg-sidebar p-4',
      card: 'flex flex-col gap-6 rounded-xl bg-card py-6 text-card-foreground shadow-sm',
    },
  },
  defaultVariants: {
    surface: 'panel',
  },
});

export type CardSurfaceVariants = VariantProps<typeof cardSurface>;

// Shared classes for the advanced full-card patterns (gauge/donut/score/etc.).
export const CARD_BASE = 'rounded-lg border border-border bg-sidebar p-4';
export const TITLE = 'text-xs text-muted-foreground';
export const DESC = 'text-xs text-muted-foreground mt-3';
