import { cn } from '../lib/utils';

export const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>): React.JSX.Element => (
  <div className="relative w-full overflow-auto" data-slot="table-container">
    <table
      className={cn('w-full caption-bottom text-sm', className)}
      data-slot="table"
      {...props}
    />
  </div>
);

export const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element => (
  <thead className={cn('[&_tr]:border-b', className)} data-slot="table-header" {...props} />
);

export const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element => (
  <tbody
    className={cn('[&_tr:last-child]:border-0', className)}
    data-slot="table-body"
    {...props}
  />
);

export const TableFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element => (
  <tfoot
    className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
    data-slot="table-footer"
    {...props}
  />
);

export const TableRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>): React.JSX.Element => (
  <tr
    className={cn(
      'border-b border-border transition-colors duration-[140ms] hover:bg-accent/40 data-[state=selected]:bg-accent',
      className
    )}
    data-slot="table-row"
    {...props}
  />
);

export const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>): React.JSX.Element => (
  <th
    className={cn(
      'sticky top-0 z-10 h-10 bg-card px-4 text-left align-middle text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className
    )}
    data-slot="table-head"
    {...props}
  />
);

export const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>): React.JSX.Element => (
  <td
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    data-slot="table-cell"
    {...props}
  />
);

export const TableCaption = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>): React.JSX.Element => (
  <caption
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    data-slot="table-caption"
    {...props}
  />
);
