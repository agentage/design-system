'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { SortAscIcon, SortDescIcon } from './filter-bar.parts';

export { FilterClear, FilterSearch } from './filter-bar.parts';
export type { FilterClearProps, FilterSearchProps } from './filter-bar.parts';

/* ── Filter Button Group ── */

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface FilterButtonGroupProps<T extends string> {
  label?: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export const FilterButtonGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: FilterButtonGroupProps<T>): React.JSX.Element => (
  <div className={cn('flex flex-col gap-1', className)} data-slot="filter-button-group">
    {label && <span className="text-xs text-muted-foreground">{label}</span>}
    <div className="flex items-center rounded-lg border border-border bg-muted/30 p-1 h-[36px]">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.icon && <span className="[&_svg]:size-3">{option.icon}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

/* ── Sort Button Group ── */

export interface SortOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface FilterSortProps<T extends string> {
  label?: string;
  options: SortOption<T>[];
  value: T;
  order: 'asc' | 'desc';
  onChange: (value: T, order: 'asc' | 'desc') => void;
  className?: string;
}

export const FilterSort = <T extends string>({
  label,
  options,
  value,
  order,
  onChange,
  className,
}: FilterSortProps<T>): React.JSX.Element => (
  <div className={cn('flex flex-col gap-1', className)} data-slot="filter-sort">
    {label && <span className="text-xs text-muted-foreground">{label}</span>}
    <div className="flex items-center rounded-lg border border-border bg-muted/30 p-1 h-[36px]">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (isActive) {
                onChange(option.value, order === 'asc' ? 'desc' : 'asc');
              } else {
                onChange(option.value, 'asc');
              }
            }}
            aria-pressed={isActive}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.icon && <span className="[&_svg]:size-3">{option.icon}</span>}
            {option.label}
            {isActive && (order === 'asc' ? <SortAscIcon /> : <SortDescIcon />)}
          </button>
        );
      })}
    </div>
  </div>
);

/* ── Filter Bar Container ── */

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-end gap-3', className)}
      data-slot="filter-bar"
      {...props}
    >
      {children}
    </div>
  )
);
FilterBar.displayName = 'FilterBar';

/* ── Filter Results Counter ── */

export interface FilterResultsProps {
  icon?: React.ReactNode;
  filtered: number;
  total: number;
  label?: string;
  className?: string;
}

export const FilterResults = React.forwardRef<HTMLDivElement, FilterResultsProps>(
  ({ icon, filtered, total, label = 'items', className }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
      data-slot="filter-results"
      aria-live="polite"
    >
      {icon && <span className="[&_svg]:size-3.5">{icon}</span>}
      {filtered < total ? (
        <span>
          Showing {filtered} of {total} {label}
        </span>
      ) : (
        <span>
          {total} {label}
        </span>
      )}
    </div>
  )
);
FilterResults.displayName = 'FilterResults';
