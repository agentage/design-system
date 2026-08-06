'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface DatePickerProps {
  value?: Date;
  onValueChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CalendarIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const toInputValue = (date: Date): string => date.toISOString().split('T')[0];

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value, onValueChange, placeholder = 'Pick a date', disabled = false, className }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string>(
      value ? toInputValue(value) : ''
    );
    // Derived, so a controlled `value` always wins over the last locally picked date.
    const inputValue = value === undefined ? internalValue : toInputValue(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const dateStr = e.target.value;
      setInternalValue(dateStr);
      setOpen(false);
      if (dateStr) {
        onValueChange?.(new Date(dateStr + 'T00:00:00'));
      }
    };

    const displayValue = value
      ? value.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : '';

    // showPicker throws outside a user gesture and is missing in Firefox/older Safari.
    const handleClick = (): void => {
      const input = inputRef.current;
      if (disabled || !input) return;
      try {
        input.showPicker();
        setOpen(true);
      } catch {
        input.focus();
        input.click();
      }
    };

    return (
      <div className={cn('relative', className)} data-slot="date-picker">
        <button
          ref={ref}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            'flex h-9 w-full items-center gap-2 rounded-md border border-border bg-muted/30 px-3 text-sm cursor-pointer transition-colors',
            'hover:border-ring focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20',
            disabled && 'opacity-50 cursor-not-allowed',
            !displayValue && 'text-muted-foreground'
          )}
        >
          <CalendarIcon />
          <span className="flex-1 truncate text-left">{displayValue || placeholder}</span>
        </button>
        <input
          ref={inputRef}
          type="date"
          value={inputValue}
          onChange={handleChange}
          onBlur={() => {
            setOpen(false);
          }}
          disabled={disabled}
          className="sr-only"
          aria-label={placeholder}
          tabIndex={-1}
        />
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';
