'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const checkboxVariants = cva(
  [
    'flex size-4 shrink-0 items-center justify-center rounded border transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ],
  {
    variants: {
      marked: {
        true: 'border-primary bg-primary text-primary-foreground',
        false: 'border-muted-foreground/50 bg-background hover:border-muted-foreground',
      },
      error: { true: 'border-destructive', false: '' },
      disabled: { true: 'cursor-not-allowed opacity-50', false: '' },
    },
    defaultVariants: { marked: false, error: false, disabled: false },
  }
);

export interface CheckboxProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'value'
> {
  checked?: boolean;
  /** Renders the mixed state (`aria-checked="mixed"`) and sets it on the hidden native input. */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Submitted with the surrounding form via a hidden native input. */
  name?: string;
  value?: string;
  required?: boolean;
  error?: boolean;
}

const CheckIcon = (): React.JSX.Element => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const MinusIcon = (): React.JSX.Element => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onCheckedChange,
      disabled = false,
      error = false,
      className,
      name,
      value = 'on',
      required,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      onClick?.(e);
      if (!disabled) onCheckedChange?.(!checked);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      onKeyDown?.(e);
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!disabled) onCheckedChange?.(!checked);
      }
    };

    const marked = checked || indeterminate;

    return (
      <>
        <button
          ref={ref}
          type="button"
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-required={required}
          aria-invalid={error || undefined}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          data-slot="checkbox"
          data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
          className={cn(checkboxVariants({ marked, error, disabled, className }))}
          {...props}
        >
          {indeterminate ? <MinusIcon /> : checked && <CheckIcon />}
        </button>
        {name && (
          <input
            ref={inputRef}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            required={required}
            disabled={disabled}
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only pointer-events-none absolute"
          />
        )}
      </>
    );
  }
);
Checkbox.displayName = 'Checkbox';
