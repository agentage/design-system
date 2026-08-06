'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { nextListIndex } from '../lib/list-navigation';
import { cn } from '../lib/utils';

export type ToggleGroupColumns = 1 | 2 | 3 | 4 | 5 | 6;

// Tailwind cannot generate class names at runtime, so the static ones are mapped explicitly.
export const toggleGroupVariants = cva('grid gap-2', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    },
  },
});

export const toggleButtonVariants = cva(
  [
    'flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  ],
  {
    variants: {
      selected: {
        true: 'bg-primary text-primary-foreground',
        false:
          'bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground border border-border',
      },
      vertical: { true: 'flex-col gap-1 py-1.5', false: '' },
      error: { true: 'border border-destructive', false: '' },
    },
    defaultVariants: { selected: false, vertical: false, error: false },
  }
);

const isGridColumns = (n: number): n is ToggleGroupColumns =>
  Number.isInteger(n) && n >= 1 && n <= 6;

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface ToggleGroupProps<T extends string> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'children'
> {
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
  columns?: ToggleGroupColumns;
  vertical?: boolean;
  error?: boolean;
}

export const ToggleGroup = <T extends string>({
  value,
  onChange,
  options,
  columns,
  vertical = false,
  error = false,
  className,
  style,
  ...props
}: ToggleGroupProps<T>): React.JSX.Element => {
  const buttonsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const gridCols = columns ?? Math.max(1, options.length);
  const mapped = isGridColumns(gridCols);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const tabStop = selectedIndex >= 0 ? selectedIndex : 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    const buttons = buttonsRef.current;
    const focused = buttons.findIndex((button) => button === document.activeElement);
    const next = nextListIndex(e.key, focused >= 0 ? focused : tabStop, options.length);
    if (next === null) return;
    e.preventDefault();
    onChange(options[next].value);
    buttons[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-invalid={error || undefined}
      className={cn(toggleGroupVariants({ columns: mapped ? gridCols : undefined, className }))}
      style={
        mapped
          ? style
          : { gridTemplateColumns: `repeat(${String(gridCols)}, minmax(0, 1fr))`, ...style }
      }
      data-slot="toggle-group"
      {...props}
    >
      {options.map((option, index) => (
        <ToggleButton
          key={option.value}
          ref={(node) => {
            buttonsRef.current[index] = node;
          }}
          selected={value === option.value}
          tabIndex={index === tabStop ? 0 : -1}
          onKeyDown={handleKeyDown}
          onClick={() => {
            onChange(option.value);
          }}
          vertical={vertical}
          error={error}
          aria-label={option.label}
        >
          {option.icon}
          <span>{option.label}</span>
        </ToggleButton>
      ))}
    </div>
  );
};

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  onClick: () => void;
  vertical?: boolean;
  children: React.ReactNode;
  error?: boolean;
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ selected, vertical = false, error = false, children, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      data-slot="toggle-button"
      className={cn(toggleButtonVariants({ selected, vertical, error, className }))}
      {...props}
    >
      {children}
    </button>
  )
);
ToggleButton.displayName = 'ToggleButton';
