import * as React from 'react';
import {
  formatUsagePercent,
  resolveUsageLevel,
  usageFraction,
  type UsageLevel,
  type UsageThresholds,
} from '../lib/usage-level';
import { cn } from '../lib/utils';
import { Alert } from './alert';

export type { UsageLevel, UsageThresholds } from '../lib/usage-level';

const ALERT_VARIANT: Record<Exclude<UsageLevel, 'default'>, 'warning' | 'destructive'> = {
  warning: 'warning',
  critical: 'destructive',
};

const defaultMessage = (label: string, fraction: number, level: UsageLevel): string => {
  const pct = formatUsagePercent(fraction);
  if (fraction >= 1) return `You have reached your ${label} limit (${pct} used).`;
  if (level === 'critical') return `You are almost out of ${label} (${pct} used).`;
  return `You are approaching your ${label} limit (${pct} used).`;
};

export interface QuotaBannerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'title'
> {
  value: number;
  max: number;
  /** Names the quota in the default message, e.g. `storage`. */
  label: string;
  thresholds?: Partial<UsageThresholds>;
  /** Replaces the generated sentence. */
  message?: React.ReactNode;
  /** Trailing slot — usually an upgrade or cleanup button. */
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Inline quota warning built on Alert. Renders nothing below the warning
 * threshold, so it can sit permanently in a settings page.
 */
export const QuotaBanner = React.forwardRef<HTMLDivElement, QuotaBannerProps>(
  ({ value, max, label, thresholds, message, action, icon, className, ...props }, ref) => {
    const fraction = usageFraction(value, max);
    const level = resolveUsageLevel(fraction, thresholds);
    if (level === 'default') return null;

    return (
      <Alert
        ref={ref}
        variant={ALERT_VARIANT[level]}
        icon={icon}
        role="status"
        aria-live="polite"
        data-slot="quota-banner"
        data-level={level}
        className={cn('items-center', className)}
        {...props}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span data-slot="quota-banner-message">
            {message ?? defaultMessage(label, fraction, level)}
          </span>
          {action}
        </div>
      </Alert>
    );
  }
);
QuotaBanner.displayName = 'QuotaBanner';
