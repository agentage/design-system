/** Shared quota escalation math for `UsageMeter` and `QuotaBanner`. */

export type UsageLevel = 'default' | 'warning' | 'critical';

export interface UsageThresholds {
  /** Fraction of `max` at which the meter turns amber. */
  warning: number;
  /** Fraction of `max` at which the meter turns red. */
  critical: number;
}

export const DEFAULT_USAGE_THRESHOLDS: UsageThresholds = { warning: 0.8, critical: 0.95 };

export const usageFraction = (value: number, max: number): number =>
  max > 0 ? Math.max(0, value / max) : 0;

export const resolveUsageLevel = (
  fraction: number,
  thresholds?: Partial<UsageThresholds>
): UsageLevel => {
  const { warning, critical } = { ...DEFAULT_USAGE_THRESHOLDS, ...thresholds };
  if (fraction >= critical) return 'critical';
  if (fraction >= warning) return 'warning';
  return 'default';
};

export const formatUsagePercent = (fraction: number): string =>
  `${String(Math.round(fraction * 100))}%`;
