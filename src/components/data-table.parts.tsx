'use client';

import * as React from 'react';
import { type SortDirection } from '../lib/table-sort';
import { cn } from '../lib/utils';
import { dataTableHeadVariants } from './data-table.variants';
import { TableHead } from './table';

export const SortIndicator = ({
  direction,
}: {
  direction?: SortDirection | null;
}): React.JSX.Element => (
  <svg
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('shrink-0', !direction && 'opacity-40')}
    data-slot="data-table-sort-indicator"
  >
    {direction !== 'desc' && <path d="m6 15 6-6 6 6" />}
    {direction !== 'asc' && <path d="m6 9 6 6 6-6" />}
  </svg>
);

export interface DataTableHeadCellProps {
  align?: 'left' | 'center' | 'right';
  density?: 'default' | 'compact';
  sticky?: boolean;
  sortable?: boolean;
  direction?: SortDirection | null;
  onSort?: () => void;
  width?: number | string;
  children?: React.ReactNode;
}

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

export const DataTableHeadCell = ({
  align,
  density,
  sticky,
  sortable = false,
  direction,
  onSort,
  width,
  children,
}: DataTableHeadCellProps): React.JSX.Element => (
  <TableHead
    sticky={sticky}
    aria-sort={sortable ? (direction ? ARIA_SORT[direction] : 'none') : undefined}
    style={width === undefined ? undefined : { width }}
    className={cn(dataTableHeadVariants({ density, align }))}
    data-slot="data-table-head"
  >
    {sortable ? (
      <button
        type="button"
        onClick={onSort}
        className={cn(
          'inline-flex items-center gap-1 uppercase tracking-[0.04em] transition-colors',
          'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
          direction && 'text-foreground'
        )}
        data-slot="data-table-sort-button"
      >
        {children}
        <SortIndicator direction={direction} />
      </button>
    ) : (
      children
    )}
  </TableHead>
);

const STRETCHED =
  'after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring';

export interface RowActivatorProps {
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

/** Stretched link/button: one real control per row, actions stay clickable above it (z-10). */
export const RowActivator = ({ href, onClick, children }: RowActivatorProps): React.JSX.Element =>
  href === undefined ? (
    <button type="button" onClick={onClick} className={cn(STRETCHED, 'text-left')}>
      {children}
    </button>
  ) : (
    <a href={href} onClick={onClick} className={cn(STRETCHED, 'block')}>
      {children}
    </a>
  );
