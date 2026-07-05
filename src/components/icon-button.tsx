import { cn } from '../lib/utils';

export interface IconButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title?: string;
  'aria-label'?: string;
  disabled?: boolean;
  className?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export const IconButton = ({
  icon,
  onClick,
  title,
  'aria-label': ariaLabel,
  disabled,
  className,
  onMouseDown,
}: IconButtonProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    onMouseDown={onMouseDown}
    title={title}
    aria-label={ariaLabel ?? title}
    disabled={disabled}
    data-slot="icon-button"
    className={cn(
      'flex items-center justify-center rounded-md p-1.5 transition-colors',
      'text-muted-foreground hover:bg-accent hover:text-foreground',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}
  >
    {icon}
  </button>
);
