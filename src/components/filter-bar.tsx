import * as React from 'react';
import { cn } from '../lib/utils';

/* ── Search Input ── */

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

const ClearIcon = (): React.JSX.Element => (
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

export interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const FilterSearch = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: FilterSearchProps): React.JSX.Element => (
  <div className={cn('relative flex-1 min-w-[200px]', className)} data-slot="filter-search">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
      <SearchIcon />
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'w-full rounded-lg border border-border bg-background py-2 pl-9 text-sm',
        'placeholder:text-muted-foreground/60',
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
        'transition-colors',
        value ? 'pr-8' : 'pr-3'
      )}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Clear search"
      >
        <ClearIcon />
      </button>
    )}
  </div>
);

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

const SortAscIcon = (): React.JSX.Element => (
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

const SortDescIcon = (): React.JSX.Element => (
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

export const FilterBar = ({ className, children, ...props }: FilterBarProps): React.JSX.Element => (
  <div
    className={cn('flex flex-wrap items-end gap-3', className)}
    data-slot="filter-bar"
    {...props}
  >
    {children}
  </div>
);

/* ── Filter Results Counter ── */

export interface FilterResultsProps {
  icon?: React.ReactNode;
  filtered: number;
  total: number;
  label?: string;
  className?: string;
}

export const FilterResults = ({
  icon,
  filtered,
  total,
  label = 'items',
  className,
}: FilterResultsProps): React.JSX.Element => (
  <div
    className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
    data-slot="filter-results"
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
);

/* ── Clear Filters Button ── */

export interface FilterClearProps {
  active: boolean;
  onClear: () => void;
  className?: string;
}

export const FilterClear = ({
  active,
  onClear,
  className,
}: FilterClearProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClear}
    disabled={!active}
    className={cn(
      'flex items-center gap-1 rounded-md px-2 py-1.5 self-end text-sm transition-colors',
      active
        ? 'text-muted-foreground hover:text-foreground cursor-pointer'
        : 'text-transparent pointer-events-none',
      className
    )}
    data-slot="filter-clear"
  >
    <ClearIcon />
    Clear filters
  </button>
);
