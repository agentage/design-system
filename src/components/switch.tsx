'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const switchVariants = cva(
  [
    'inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  ],
  {
    variants: {
      checked: { true: 'bg-primary', false: 'bg-muted' },
      error: { true: 'border-destructive', false: '' },
      disabled: { true: 'cursor-not-allowed opacity-50', false: '' },
    },
    defaultVariants: { checked: false, error: false, disabled: false },
  }
);

export const switchThumbVariants = cva(
  'pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform duration-200',
  {
    variants: {
      checked: { true: 'translate-x-4', false: 'translate-x-0' },
    },
    defaultVariants: { checked: false },
  }
);

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  error?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      disabled = false,
      error = false,
      className,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const toggle = (): void => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      onClick?.(e);
      toggle();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      onKeyDown?.(e);
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-invalid={error || undefined}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-slot="switch"
        className={cn(switchVariants({ checked, error, disabled, className }))}
        {...props}
      >
        <span aria-hidden="true" className={cn(switchThumbVariants({ checked }))} />
      </button>
    );
  }
);
Switch.displayName = 'Switch';
