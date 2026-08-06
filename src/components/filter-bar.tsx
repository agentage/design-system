'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { filterOptionVariants, SortAscIcon, SortDescIcon } from './filter-bar.parts';

export {
  FilterClear,
  filterClearVariants,
  FilterSearch,
  filterOptionVariants,
  filterSearchInputVariants,
} from './filter-bar.parts';
export type { FilterClearProps, FilterSearchProps } from './filter-bar.parts';

/* ── Filter Button Group ── */

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface FilterButtonGroupProps<T extends string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'children'
> {
  label?: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const FilterButtonGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
  className,
  ...props
}: FilterButtonGroupProps<T>): React.JSX.Element => (
  <div className={cn('flex flex-col gap-1', className)} data-slot="filter-button-group" {...props}>
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
            className={cn(filterOptionVariants({ active: isActive }))}
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

export interface FilterSortProps<T extends string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'children'
> {
  label?: string;
  options: SortOption<T>[];
  value: T;
  order: 'asc' | 'desc';
  onChange: (value: T, order: 'asc' | 'desc') => void;
}

export const FilterSort = <T extends string>({
  label,
  options,
  value,
  order,
  onChange,
  className,
  ...props
}: FilterSortProps<T>): React.JSX.Element => (
  <div className={cn('flex flex-col gap-1', className)} data-slot="filter-sort" {...props}>
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
            className={cn(filterOptionVariants({ active: isActive }))}
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

export type FilterBarProps = React.HTMLAttributes<HTMLDivElement>;

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

export interface FilterResultsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  icon?: React.ReactNode;
  filtered: number;
  total: number;
  label?: string;
}

export const FilterResults = React.forwardRef<HTMLDivElement, FilterResultsProps>(
  ({ icon, filtered, total, label = 'items', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
      data-slot="filter-results"
      aria-live="polite"
      {...props}
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
