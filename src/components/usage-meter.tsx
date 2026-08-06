import * as React from 'react';
import { cva } from 'class-variance-authority';
import {
  resolveUsageLevel,
  usageFraction,
  type UsageLevel,
  type UsageThresholds,
} from '../lib/usage-level';
import { cn } from '../lib/utils';
import { progressVariants } from './progress';

export type { UsageLevel, UsageThresholds } from '../lib/usage-level';
export { DEFAULT_USAGE_THRESHOLDS, resolveUsageLevel } from '../lib/usage-level';

export const usageMeterTrackVariants = cva('w-full overflow-hidden rounded-full bg-muted', {
  variants: {
    size: { sm: 'h-1.5', md: 'h-2' },
  },
  defaultVariants: { size: 'md' },
});

export const usageMeterLabelVariants = cva('flex items-baseline justify-between gap-3', {
  variants: {
    size: { sm: 'text-xs', md: 'text-sm' },
  },
  defaultVariants: { size: 'md' },
});

export const usageMeterValueVariants = cva('tabular-nums', {
  variants: {
    level: {
      default: 'text-muted-foreground',
      warning: 'text-warning',
      critical: 'text-destructive',
    },
  },
  defaultVariants: { level: 'default' },
});

/** `critical` maps onto the destructive bar; the other two are 1:1 with Progress. */
const BAR_VARIANT: Record<UsageLevel, 'default' | 'warning' | 'destructive'> = {
  default: 'default',
  warning: 'warning',
  critical: 'destructive',
};

export interface UsageMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  max: number;
  /** Accessible name and the text of the label row. */
  label: string;
  /** Renders the trailing value; defaults to `"<value> / <max>"` — format upstream. */
  formatValue?: (value: number, max: number) => string;
  thresholds?: Partial<UsageThresholds>;
  size?: 'sm' | 'md';
  showValue?: boolean;
}

/**
 * Quota counter: a label row over a Progress-styled bar that escalates
 * default → warning → destructive as the fraction crosses the thresholds.
 */
export const UsageMeter = React.forwardRef<HTMLDivElement, UsageMeterProps>(
  (
    {
      value,
      max,
      label,
      formatValue = (v, m) => `${String(v)} / ${String(m)}`,
      thresholds,
      size = 'md',
      showValue = true,
      className,
      ...props
    },
    ref
  ) => {
    const labelId = `${React.useId()}-usage-meter`;
    const fraction = usageFraction(value, max);
    const level = resolveUsageLevel(fraction, thresholds);
    const formatted = formatValue(value, max);

    return (
      <div
        ref={ref}
        data-slot="usage-meter"
        data-level={level}
        className={cn('space-y-1.5', className)}
        {...props}
      >
        <div className={cn(usageMeterLabelVariants({ size }))}>
          <span id={labelId} className="font-medium text-foreground">
            {label}
          </span>
          {showValue && (
            <span data-slot="usage-meter-value" className={cn(usageMeterValueVariants({ level }))}>
              {formatted}
            </span>
          )}
        </div>
        <div
          role="meter"
          aria-labelledby={labelId}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuetext={formatted}
          data-slot="usage-meter-track"
          className={cn(usageMeterTrackVariants({ size }))}
        >
          <div
            data-slot="usage-meter-fill"
            className={cn(progressVariants({ variant: BAR_VARIANT[level] }))}
            style={{ width: `${String(Math.min(100, fraction * 100))}%` }}
          />
        </div>
      </div>
    );
  }
);
UsageMeter.displayName = 'UsageMeter';
