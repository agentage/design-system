'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { filterClearVariants, filterSearchInputVariants } from './filter-bar.variants';

export {
  filterClearVariants,
  filterOptionVariants,
  filterSearchInputVariants,
} from './filter-bar.variants';

/* ── Icons ── */

const SearchIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const ClearIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const SortAscIcon = (): React.JSX.Element => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 8 4-4 4 4" />
    <path d="M7 4v16" />
    <path d="M11 12h4" />
    <path d="M11 16h7" />
    <path d="M11 20h10" />
  </svg>
);

export const SortDescIcon = (): React.JSX.Element => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 16 4 4 4-4" />
    <path d="M7 20V4" />
    <path d="M11 4h10" />
    <path d="M11 8h7" />
    <path d="M11 12h4" />
  </svg>
);

/* ── Search Input ── */

export interface FilterSearchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Applied to the wrapper; the input receives the remaining props. */
  className?: string;
}

export const FilterSearch = React.forwardRef<HTMLInputElement, FilterSearchProps>(
  ({ value, onChange, placeholder = 'Search...', className, ...props }, ref) => (
    <div className={cn('relative flex-1 min-w-[200px]', className)} data-slot="filter-search">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
        <SearchIcon />
      </span>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(filterSearchInputVariants({ clearable: !!value }))}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
          )}
          aria-label="Clear search"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  )
);
FilterSearch.displayName = 'FilterSearch';

/* ── Clear Filters Button ── */

export interface FilterClearProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  active: boolean;
  onClear: () => void;
}

export const FilterClear = React.forwardRef<HTMLButtonElement, FilterClearProps>(
  ({ active, onClear, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClear}
      disabled={!active}
      className={cn(filterClearVariants({ active }), className)}
      data-slot="filter-clear"
      {...props}
    >
      <ClearIcon />
      Clear filters
    </button>
  )
);
FilterClear.displayName = 'FilterClear';
