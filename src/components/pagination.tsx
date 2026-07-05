import { cn } from '../lib/utils';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const ChevronLeft = (): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = (): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ChevronsLeft = (): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m11 17-5-5 5-5" />
    <path d="m18 17-5-5 5-5" />
  </svg>
);

const ChevronsRight = (): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 17 5-5-5-5" />
    <path d="m13 17 5-5-5-5" />
  </svg>
);

const PaginationButton = ({
  className,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element => (
  <button
    type="button"
    disabled={disabled}
    className={cn(
      'inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
);

export const Pagination = ({
  page,
  pageCount,
  onPageChange,
  className,
}: PaginationProps): React.JSX.Element => {
  const canPrev = page > 1;
  const canNext = page < pageCount;

  const getVisiblePages = (): number[] => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pageCount, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center gap-1', className)}
      data-slot="pagination"
    >
      <PaginationButton onClick={() => onPageChange(1)} disabled={!canPrev} aria-label="First page">
        <ChevronsLeft />
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </PaginationButton>

      {getVisiblePages().map((p) => (
        <PaginationButton
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(p === page && 'bg-primary text-primary-foreground hover:bg-primary/90')}
        >
          {p}
        </PaginationButton>
      ))}

      <PaginationButton
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
        aria-label="Next page"
      >
        <ChevronRight />
      </PaginationButton>
      <PaginationButton
        onClick={() => onPageChange(pageCount)}
        disabled={!canNext}
        aria-label="Last page"
      >
        <ChevronsRight />
      </PaginationButton>
    </nav>
  );
};
