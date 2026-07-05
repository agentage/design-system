import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const statusDotVariants = cva('inline-block shrink-0 rounded-full', {
  variants: {
    variant: {
      online: 'bg-success',
      offline: 'bg-muted-foreground',
      working: 'bg-success animate-pulse',
      error: 'bg-destructive',
      warning: 'bg-warning',
      info: 'bg-info',
      pending: 'bg-muted-foreground animate-pulse',
    },
    size: {
      sm: 'size-1.5',
      md: 'size-2',
      lg: 'size-2.5',
    },
  },
  defaultVariants: {
    variant: 'offline',
    size: 'md',
  },
});

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusDotVariants> {
  label?: string;
}

export const StatusDot = ({
  variant,
  size,
  label,
  className,
  ...props
}: StatusDotProps): React.JSX.Element => (
  <span
    className={cn('inline-flex items-center gap-1.5', label && 'text-sm')}
    data-slot="status-dot"
  >
    <span
      className={cn(statusDotVariants({ variant, size, className }))}
      role="status"
      aria-label={label ?? String(variant)}
      {...props}
    />
    {label && <span className="text-muted-foreground leading-none">{label}</span>}
  </span>
);
