import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border border-border',
        outline: 'border border-border text-foreground bg-transparent',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
        info: 'bg-info/10 text-info border border-info/20',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-accent',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outline',
      interactive: false,
    },
  }
);

const XIcon = (): React.JSX.Element => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export interface ChipProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'>,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void;
  onClick?: () => void;
  removeLabel?: string;
}

export const Chip = ({
  className,
  variant,
  interactive,
  children,
  onRemove,
  onClick,
  removeLabel = 'Remove',
  ...props
}: ChipProps): React.JSX.Element => {
  const clickable = !!onClick || !!interactive;
  return (
    <span
      className={cn(chipVariants({ variant, interactive: clickable, className }))}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      data-slot="chip"
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={removeLabel}
          className="-mr-1 rounded-full p-0.5 transition-colors hover:bg-foreground/10"
        >
          <XIcon />
        </button>
      )}
    </span>
  );
};
