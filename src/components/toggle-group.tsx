'use client';

import * as React from 'react';
import { nextListIndex } from '../lib/list-navigation';
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
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  vertical?: boolean;
  className?: string;
  'aria-label'?: string;
}

// Tailwind cannot generate class names at runtime, so the static ones are mapped explicitly.
const GRID_COLS: Record<number, string | undefined> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

export const ToggleGroup = <T extends string>({
  value,
  onChange,
  options,
  columns,
  vertical = false,
  className,
  'aria-label': ariaLabel,
}: ToggleGroupProps<T>): React.JSX.Element => {
  const buttonsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const gridCols = columns ?? Math.max(1, options.length);
  const gridClass = GRID_COLS[gridCols];
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
      aria-label={ariaLabel}
      className={cn('grid gap-2', gridClass, className)}
      style={
        gridClass
          ? undefined
          : { gridTemplateColumns: `repeat(${String(gridCols)}, minmax(0, 1fr))` }
      }
      data-slot="toggle-group"
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
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
}

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      selected,
      onClick,
      vertical = false,
      children,
      className,
      tabIndex,
      onKeyDown,
      'aria-label': ariaLabel,
    },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
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
  )
);
ToggleButton.displayName = 'ToggleButton';
