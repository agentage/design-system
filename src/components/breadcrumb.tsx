import { cn } from '../lib/utils';

const ChevronIcon = (): React.JSX.Element => (
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
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const Breadcrumb = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>): React.JSX.Element => (
  <nav aria-label="Breadcrumb" className={className} data-slot="breadcrumb" {...props} />
);

export const BreadcrumbList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>): React.JSX.Element => (
  <ol
    className={cn('flex items-center gap-1.5 text-sm text-muted-foreground', className)}
    data-slot="breadcrumb-list"
    {...props}
  />
);

export const BreadcrumbItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>): React.JSX.Element => (
  <li
    className={cn('inline-flex items-center gap-1.5', className)}
    data-slot="breadcrumb-item"
    {...props}
  />
);

export const BreadcrumbLink = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>): React.JSX.Element => (
  <a
    className={cn('transition-colors hover:text-foreground', className)}
    data-slot="breadcrumb-link"
    {...props}
  />
);

export const BreadcrumbPage = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-medium text-foreground', className)}
    data-slot="breadcrumb-page"
    {...props}
  />
);

export const BreadcrumbSeparator = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>): React.JSX.Element => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('text-muted-foreground', className)}
    data-slot="breadcrumb-separator"
    {...props}
  >
    {children ?? <ChevronIcon />}
  </li>
);
