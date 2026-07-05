import { cn } from '../lib/utils';

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface ToggleGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
  columns?: 2 | 3 | 4;
  vertical?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const ToggleGroup = <T extends string>({
  value,
  onChange,
  options,
  columns,
  vertical = false,
  className,
  'aria-label': ariaLabel,
}: ToggleGroupProps<T>): React.JSX.Element => {
  const gridCols = columns ?? options.length;
  const gridClass =
    gridCols === 2
      ? 'grid-cols-2'
      : gridCols === 3
        ? 'grid-cols-3'
        : gridCols === 4
          ? 'grid-cols-4'
          : 'grid-cols-3';

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('grid gap-2', gridClass, className)}
      data-slot="toggle-group"
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          selected={value === option.value}
          onClick={() => {
            onChange(option.value);
          }}
          vertical={vertical}
          aria-label={option.label}
        >
          {option.icon}
          <span>{option.label}</span>
        </ToggleButton>
      ))}
    </div>
  );
};

export interface ToggleButtonProps {
  selected: boolean;
  onClick: () => void;
  vertical?: boolean;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export const ToggleButton = ({
  selected,
  onClick,
  vertical = false,
  children,
  className,
  'aria-label': ariaLabel,
}: ToggleButtonProps): React.JSX.Element => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    aria-label={ariaLabel}
    onClick={onClick}
    data-slot="toggle-button"
    className={cn(
      'flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
      selected
        ? 'bg-primary text-primary-foreground'
        : 'bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground border border-border',
      vertical && 'flex-col gap-1 py-1.5',
      className
    )}
  >
    {children}
  </button>
);
