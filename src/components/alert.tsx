import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const alertVariants = cva(
  'flex gap-3 rounded-lg border p-4 text-sm [&>svg]:shrink-0 [&>svg]:size-4 [&>svg]:mt-0.5',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        info: 'border-info/30 bg-info/10 text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const CloseIcon = (): React.JSX.Element => (
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

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const Alert = ({
  className,
  variant,
  icon,
  onClose,
  children,
  ...props
}: AlertProps): React.JSX.Element => (
  <div
    role="alert"
    data-slot="alert"
    className={cn(alertVariants({ variant, className }))}
    {...props}
  >
    {icon}
    <div className="flex-1">{children}</div>
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-sm p-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Dismiss"
      >
        <CloseIcon />
      </button>
    )}
  </div>
);
