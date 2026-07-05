import { cn } from '../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = ({
  variant = 'rectangular',
  className,
  ...props
}: SkeletonProps): React.JSX.Element => (
  <div
    data-slot="skeleton"
    className={cn(
      'animate-pulse bg-muted',
      variant === 'circular' && 'rounded-full',
      variant === 'text' && 'h-4 w-full rounded-md',
      variant === 'rectangular' && 'rounded-md',
      className
    )}
    {...props}
  />
);
