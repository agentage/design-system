'use client';
import * as React from 'react';
import { useState } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { buttonVariants } from './button.variants';

const CopyIcon = (): React.JSX.Element => (
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
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = (): React.JSX.Element => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ErrorIcon = (): React.JSX.Element => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

// Fallback for insecure contexts / denied permissions: select a detached textarea and execCommand.
const legacyCopy = (text: string): boolean => {
  if (typeof document === 'undefined') return false;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  area.style.pointerEvents = 'none';
  document.body.appendChild(area);
  try {
    area.select();
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(area);
  }
};

export interface CopyButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  text: string;
  label?: string;
  successLabel?: string;
  /** Shown briefly when both the async and legacy copy paths fail. */
  errorLabel?: string;
  duration?: number;
  iconOnly?: boolean;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      text,
      label = 'Copy',
      successLabel = 'Copied',
      errorLabel = 'Failed',
      duration = 1500,
      iconOnly = false,
      variant = 'outline',
      size,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
    const copied = state === 'copied';
    const failed = state === 'error';

    const handle = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        ok = legacyCopy(text);
      }
      setState(ok ? 'copied' : 'error');
      setTimeout(() => setState('idle'), duration);
    };

    const currentLabel = copied ? successLabel : failed ? errorLabel : label;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(buttonVariants({ variant, size: iconOnly ? 'icon-sm' : size }), className)}
        onClick={handle}
        aria-label={iconOnly ? currentLabel : undefined}
        data-slot="copy-button"
        data-copied={copied || undefined}
        data-error={failed || undefined}
        {...props}
      >
        {copied ? <CheckIcon /> : failed ? <ErrorIcon /> : <CopyIcon />}
        {!iconOnly && <span aria-live="polite">{currentLabel}</span>}
      </button>
    );
  }
);
CopyButton.displayName = 'CopyButton';
