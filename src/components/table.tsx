import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const TABLE_HEAD_BASE =
  'h-10 bg-card px-4 text-left align-middle text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground [&:has([role=checkbox])]:pr-0';

// Empty cva base keeps the pin classes ahead of TABLE_HEAD_BASE, so the merged string is unchanged.
export const tableHeadVariants = cva('', {
  variants: {
    sticky: {
      true: 'sticky top-0 z-10',
      false: '',
    },
  },
  defaultVariants: {
    sticky: true,
  },
});

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto" data-slot="table-container">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        data-slot="table"
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('[&_tr]:border-b', className)}
    data-slot="table-header"
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    data-slot="table-body"
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
    data-slot="table-footer"
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border transition-colors duration-[140ms] hover:bg-accent/40 data-[state=selected]:bg-accent',
      className
    )}
    data-slot="table-row"
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>, VariantProps<typeof tableHeadVariants> {
  /** Pin the header cell while the table body scrolls. */
  sticky?: boolean;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sticky = true, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      className={cn(tableHeadVariants({ sticky }), TABLE_HEAD_BASE, className)}
      data-slot="table-head"
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-4 py-2.5 align-middle [&:has([role=checkbox])]:pr-0', className)}
    data-slot="table-cell"
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    data-slot="table-caption"
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';
