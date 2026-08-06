'use client';

import * as React from 'react';
import {
  compareValues,
  nextSortState,
  type SortableValue,
  type SortState,
} from '../lib/table-sort';
import { cn } from '../lib/utils';
import { DataTableHeadCell, RowActivator } from './data-table.parts';
import { dataTableCellVariants } from './data-table.variants';
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from './table';

export type { SortDirection, SortState } from '../lib/table-sort';
export { dataTableCellVariants, dataTableHeadVariants } from './data-table.variants';

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  nowrap?: boolean;
  width?: number | string;
  cell?: (row: T) => React.ReactNode;
  /** Sort key when the displayed cell is not what you sort on. */
  sortValue?: (row: T) => SortableValue;
  /** Full comparator; wins over `sortValue`. */
  compare?: (a: T, b: T) => number;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  density?: 'default' | 'compact';
  /** Pin the header row while the container scrolls. */
  sticky?: boolean;
  /** Controlled sort; omit for the internal state seeded by `defaultSort`. */
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  rowKey?: (row: T, index: number) => string;
  rowHref?: (row: T) => string | undefined;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
  empty?: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLTableElement>;
}

const fieldValue = <T,>(row: T, key: string): SortableValue =>
  (row as Record<string, SortableValue>)[key];

const renderValue = (value: SortableValue): React.ReactNode =>
  value === null || value === undefined ? null : String(value);

const sortRows = <T,>(data: T[], columns: DataTableColumn<T>[], active: SortState | null): T[] => {
  const column = active && columns.find((c) => c.key === active.key);
  if (!active || !column) return data;
  const direction = active.direction === 'asc' ? 1 : -1;
  const compare =
    column.compare ??
    ((a: T, b: T) =>
      compareValues(
        column.sortValue ? column.sortValue(a) : fieldValue(a, column.key),
        column.sortValue ? column.sortValue(b) : fieldValue(b, column.key)
      ));
  return [...data].sort((a, b) => direction * compare(a, b));
};

/**
 * Column-def driven table over the `Table` primitives: client-side sorting, two densities,
 * row links and row actions. Non-goal: virtualization — paginate large sets instead.
 */
export const DataTable = <T,>({
  columns,
  data,
  density = 'default',
  sticky = true,
  sort,
  defaultSort = null,
  onSortChange,
  rowKey,
  rowHref,
  onRowClick,
  rowActions,
  empty,
  caption,
  className,
  ref,
}: DataTableProps<T>): React.JSX.Element => {
  const [internalSort, setInternalSort] = React.useState<SortState | null>(defaultSort);
  const active = sort === undefined ? internalSort : sort;

  const handleSort = (key: string): void => {
    const next = nextSortState(active, key);
    if (sort === undefined) setInternalSort(next);
    onSortChange?.(next);
  };

  const rows = React.useMemo(() => sortRows(data, columns, active), [data, columns, active]);
  const columnCount = columns.length + (rowActions ? 1 : 0);

  return (
    <Table ref={ref} className={className} data-slot="data-table">
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <DataTableHeadCell
              key={column.key}
              align={column.align}
              density={density}
              sticky={sticky}
              sortable={column.sortable}
              direction={active?.key === column.key ? active.direction : null}
              onSort={() => handleSort(column.key)}
              width={column.width}
            >
              {column.header}
            </DataTableHeadCell>
          ))}
          {rowActions && <DataTableHeadCell density={density} sticky={sticky} width="2.5rem" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="p-0" data-slot="data-table-empty">
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, index) => {
            const href = rowHref?.(row);
            const interactive = href !== undefined || onRowClick !== undefined;
            return (
              <TableRow
                key={rowKey ? rowKey(row, index) : String(index)}
                className={cn(interactive && 'relative')}
                data-slot="data-table-row"
              >
                {columns.map((column, columnIndex) => {
                  const content = column.cell
                    ? column.cell(row)
                    : renderValue(fieldValue(row, column.key));
                  return (
                    <TableCell
                      key={column.key}
                      className={cn(
                        dataTableCellVariants({
                          density,
                          align: column.align,
                          nowrap: column.nowrap,
                        })
                      )}
                      data-slot="data-table-cell"
                    >
                      {columnIndex === 0 && interactive ? (
                        <RowActivator
                          href={href}
                          onClick={onRowClick ? () => onRowClick(row) : undefined}
                        >
                          {content}
                        </RowActivator>
                      ) : (
                        content
                      )}
                    </TableCell>
                  );
                })}
                {rowActions && (
                  <TableCell
                    className={cn(dataTableCellVariants({ density }), 'relative z-10 text-right')}
                    data-slot="data-table-actions"
                  >
                    {rowActions(row)}
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
