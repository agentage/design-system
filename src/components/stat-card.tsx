import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Progress } from './progress';

// `up`/`down` are direction aliases kept for compat; the rest is the canonical status vocabulary.
export const TREND_TONE = {
  up: 'text-success',
  down: 'text-destructive',
  default: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  info: 'text-info',
} as const;

export type TrendTone = keyof typeof TREND_TONE;

export const statCardTrendVariants = cva(
  'flex items-center gap-1 rounded-md px-2 py-1 text-2xs font-medium border border-border bg-muted/30',
  {
    variants: { tone: TREND_TONE },
    defaultVariants: { tone: 'up' },
  }
);

export interface StatCardTrend {
  value: string;
  up: boolean;
  /** Overrides the colour derived from `up`. */
  tone?: TrendTone;
}

export const statCardVariants = cva(
  'rounded-lg border border-border bg-sidebar p-5 transition-[transform,box-shadow,border-color] duration-[140ms] hover:-translate-y-[3px] hover:border-muted-foreground hover:shadow-md',
  {
    variants: {
      pressable: {
        true: 'w-full cursor-pointer text-left active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        false: '',
      },
    },
    defaultVariants: { pressable: false },
  }
);

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  iconColor?: string;
  title: string;
  value: string | number;
  trend?: StatCardTrend;
  description?: React.ReactNode;
  /** 0-100; renders a Progress bar under the value. */
  progress?: number;
  /** Accessible name for the progress bar; defaults to the card title. */
  progressLabel?: string;
  /** Renders the card as a button (click + keyboard + active state). */
  pressable?: boolean;
}

const TrendIcon = (): React.JSX.Element => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      icon,
      iconColor,
      title,
      value,
      trend,
      description,
      progress,
      progressLabel,
      pressable = false,
      className,
      ...props
    },
    ref
  ) => {
    const body = (
      <>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-md [&_svg]:size-4',
                  iconColor ?? 'bg-primary-soft text-primary-emphasis'
                )}
              >
                {icon}
              </div>
            )}
            <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              {title}
            </div>
          </div>
          {trend && (
            <div
              className={cn(
                statCardTrendVariants({ tone: trend.tone ?? (trend.up ? 'up' : 'down') })
              )}
            >
              <TrendIcon />
              <span className="sr-only">{trend.up ? 'Trending up' : 'Trending down'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-semibold tabular-nums text-foreground">{value}</div>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </div>
        {progress != null && (
          <div className="mt-4" data-slot="stat-card-progress">
            <Progress value={progress} label={progressLabel ?? title} />
          </div>
        )}
      </>
    );

    if (pressable) {
      return (
        <button
          ref={ref as unknown as React.Ref<HTMLButtonElement>}
          type="button"
          className={cn(statCardVariants({ pressable: true }), className)}
          data-slot="stat-card"
          data-pressable=""
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {body}
        </button>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ pressable: false }), className)}
        data-slot="stat-card"
        {...props}
      >
        {body}
      </div>
    );
  }
);
StatCard.displayName = 'StatCard';
