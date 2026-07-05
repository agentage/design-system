import { cn } from '../lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

export const Spinner = ({
  size = 'md',
  className,
  'aria-label': ariaLabel = 'Loading',
}: SpinnerProps): React.JSX.Element => (
  <svg
    role="status"
    aria-label={ariaLabel}
    data-slot="spinner"
    viewBox="0 0 24 24"
    fill="none"
    className={cn('animate-spin text-primary', sizeClasses[size], className)}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="opacity-20"
    />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
